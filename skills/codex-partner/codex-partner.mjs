#!/usr/bin/env node
// Lets Claude Code ask Codex (on the user's ChatGPT subscription) for a second
// opinion or a delegated task, and say clearly when Codex is out of quota.
//
//   node codex-partner.mjs status
//   node codex-partner.mjs ask --mode review|challenge|think|task --effort <level>
//        [--model <slug>] [--timeout-min <n>] < prompt.txt
//
// Exit codes: 0 answer printed, 3 Codex unavailable (use Claude instead),
// 1 other error, 2 bad arguments.

import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DIR = join(homedir(), '.copartner');
const PAUSE_FILE = join(DIR, 'codex-paused.json');
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max', 'ultra'];
const MODES = { review: 'read-only', challenge: 'read-only', think: 'read-only', task: 'workspace-write' };
// Matched only against Codex's own error events, never against its answer.
const LIMIT_TEXT = /usage limit|rate.?limit|quota|limit reached/i;
const now = () => Math.floor(Date.now() / 1000);

function codex(args, opts = {}) {
  // Windows installs codex as a .cmd shim, which needs a shell. Every argument
  // here is fixed or validated (no paths), and the prompt goes in on stdin.
  if (process.platform === 'win32') return spawn(['codex', ...args].join(' '), { shell: true, ...opts });
  return spawn('codex', args, opts);
}

function killTree(p) {
  try {
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(p.pid), '/T', '/F'], { stdio: 'ignore' });
    else p.kill();
  } catch {}
}

function unavailable(reason, until) {
  const when = Number.isFinite(until) && until > now() ? ` (until ${new Date(until * 1000).toISOString()})` : '';
  console.log(`CODEX_UNAVAILABLE: ${reason}${when}`);
  console.log('Do this step with Claude instead.');
  process.exit(3);
}

function readPause() {
  try {
    const p = JSON.parse(readFileSync(PAUSE_FILE, 'utf8'));
    if (Number.isFinite(p.until) && p.until > now()) return p;
    rmSync(PAUSE_FILE, { force: true });
  } catch {}
  return null;
}

function writePause(reason, until) {
  try {
    mkdirSync(DIR, { recursive: true });
    const tmp = `${PAUSE_FILE}.${process.pid}`;
    writeFileSync(tmp, JSON.stringify({ reason, until }, null, 2));
    renameSync(tmp, PAUSE_FILE);
  } catch (e) {
    console.log(`(could not remember the pause: ${e.message})`);
  }
}

// Asks Codex's local app server how the account signs in and how much of each
// usage window is spent. Resolves null if the server doesn't answer.
function readAccount(timeoutMs = 20000) {
  return new Promise(resolve => {
    let p, buf = '', authMode = null, settled = false;
    const done = v => { if (settled) return; settled = true; clearTimeout(t); killTree(p); resolve(v); };
    const t = setTimeout(() => done(null), timeoutMs);
    try { p = codex(['app-server'], { stdio: ['pipe', 'pipe', 'ignore'] }); } catch { return done(null); }
    p.on('error', () => done(null));
    p.on('close', () => done(null));
    p.stdin.on('error', () => done(null));
    const send = o => { try { p.stdin.write(JSON.stringify(o) + '\n'); } catch {} };
    p.stdout.setEncoding('utf8');
    p.stdout.on('data', d => {
      buf += d;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 1);
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        if (msg.method === 'account/updated') authMode = msg.params?.authMode ?? authMode;
        if (msg.id === 1) { send({ method: 'initialized' }); send({ id: 2, method: 'account/rateLimits/read' }); }
        if (msg.id === 2) done(msg.result ? { authMode, ...msg.result } : null);
      }
    });
    send({ id: 1, method: 'initialize', params: { clientInfo: { name: 'copartner', version: '1' } } });
  });
}

function windowsOf(a) {
  const rl = a?.rateLimits || {};
  return [['5-hour', rl.primary], ['weekly', rl.secondary]].filter(([, w]) => w);
}

// Returns { out: false } or { out: true, reason, until } from the server's view.
function exhaustion(a) {
  const rl = a.rateLimits || {};
  const ws = windowsOf(a);
  const full = ws.filter(([, w]) => w.usedPercent >= 100);
  const limited = a.ordinaryUsageAllowed === false || rl.rateLimitReachedType || full.length;
  if (!limited) return { out: false };
  // Pause until the full window resets; if the server flags a limit without a
  // full window, use the soonest future reset rather than the weekly one.
  const pick = (full.length ? full : ws).map(([, w]) => w.resetsAt).filter(x => Number.isFinite(x) && x > now());
  const until = pick.length ? (full.length ? Math.max(...pick) : Math.min(...pick)) : now() + 900;
  const which = full.map(([n]) => n).join(' and ');
  return { out: true, reason: `Codex ${which ? which + ' ' : ''}usage limit reached`, until };
}

async function status() {
  const pause = readPause();
  if (pause) return { available: false, reason: pause.reason, until: pause.until };
  const a = await readAccount();
  if (!a) return { available: false, reason: 'Codex is not installed, not logged in, or not answering' };
  const subscription = a.authMode ? a.authMode === 'chatgpt' : Boolean(a.rateLimits?.planType);
  if (!subscription) return { available: false, reason: 'Codex is not signed in with a ChatGPT subscription (it may be using an API key, which bills separately)' };
  const used = Object.fromEntries(windowsOf(a).map(([n, w]) => [n, w.usedPercent]));
  const ex = exhaustion(a);
  if (ex.out) {
    writePause(ex.reason, ex.until);
    return { available: false, reason: ex.reason, used, until: ex.until };
  }
  return { available: true, used };
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) { console.error(`unexpected argument: ${k}`); process.exit(2); }
    o[k.slice(2)] = argv[++i];
  }
  return o;
}

async function readStdin() {
  process.stdin.setEncoding('utf8');
  let s = '';
  for await (const c of process.stdin) s += c;
  return s.trim();
}

function runCodex(args, prompt, timeoutMin) {
  return new Promise(resolve => {
    const p = codex(args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let buf = '', stderr = '', answer = '', settled = false;
    const errors = [];
    const done = code => { if (settled) return; settled = true; clearTimeout(t); resolve({ code, answer, errors, stderr }); };
    const t = setTimeout(() => { errors.push('timed out'); killTree(p); done(124); }, timeoutMin * 60000);
    p.stdout.setEncoding('utf8');
    p.stderr.setEncoding('utf8');
    p.stdout.on('data', d => {
      buf += d;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 1);
        let ev;
        try { ev = JSON.parse(line); } catch { continue; }
        if (ev.type === 'item.completed' && ev.item?.type === 'agent_message') answer = ev.item.text || answer;
        if (ev.type === 'error') errors.push(String(ev.message ?? JSON.stringify(ev)));
        if (ev.type === 'turn.failed') errors.push(String(ev.error?.message ?? JSON.stringify(ev)));
      }
    });
    p.stderr.on('data', d => { stderr = (stderr + d).slice(-4000); });
    p.on('error', e => { errors.push(String(e)); done(1); });
    p.on('close', c => done(c ?? 1));
    p.stdin.on('error', () => {});
    p.stdin.end(prompt);
  });
}

async function ask(o) {
  if (!MODES[o.mode]) { console.error(`--mode must be one of ${Object.keys(MODES).join(', ')}`); process.exit(2); }
  if (!EFFORTS.includes(o.effort)) { console.error(`--effort must be one of ${EFFORTS.join(', ')}`); process.exit(2); }
  if (o.model && !/^[\w.-]+$/.test(o.model)) { console.error('bad --model'); process.exit(2); }
  const prompt = await readStdin();
  if (!prompt) { console.error('put the prompt on stdin'); process.exit(2); }

  const s = await status();
  if (!s.available) unavailable(s.reason, s.until);

  const args = ['exec', '--json', '--ephemeral', '--skip-git-repo-check', '-s', MODES[o.mode],
    '-c', `model_reasoning_effort=${o.effort}`];
  if (o.model) args.push('-m', o.model);
  args.push('-');

  const r = process.env.COPARTNER_CODEX_SIMULATE_LIMIT
    ? { code: 1, answer: '', errors: ["You've hit your usage limit. Try again later."], stderr: '' }
    : await runCodex(args, prompt, Number(o['timeout-min']) || 20);

  if (r.code === 0 && r.answer) {
    const after = await readAccount();
    console.log(r.answer);
    const ws = windowsOf(after);
    if (ws.length) console.log(`\n[codex usage: ${ws.map(([n, w]) => `${n} ${w.usedPercent}%`).join(', ')}]`);
    return;
  }

  // Failed. The server's view of usage decides whether it was the quota; the
  // error text is the backstop, with a short pause because its reset is unknown.
  const errText = r.errors.join('\n');
  const a = process.env.COPARTNER_CODEX_SIMULATE_LIMIT ? null : await readAccount();
  const ex = a ? exhaustion(a) : { out: false };
  if (ex.out) { writePause(ex.reason, ex.until); unavailable(ex.reason, ex.until); }
  if (LIMIT_TEXT.test(errText)) {
    const until = now() + 900;
    writePause('Codex reported a usage limit', until);
    unavailable('Codex reported a usage limit', until);
  }
  if (!a) unavailable('Codex is not installed, not logged in, or not answering');
  console.log(`Codex failed (exit ${r.code}).\n${(errText || r.stderr).slice(-1500)}`);
  process.exit(1);
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'status') {
  const s = await status();
  console.log(JSON.stringify(s));
  process.exit(s.available ? 0 : 3);
} else if (cmd === 'ask') {
  await ask(parseArgs(rest));
} else {
  console.error('usage: codex-partner.mjs status | ask --mode <mode> --effort <level> < prompt');
  process.exit(2);
}
