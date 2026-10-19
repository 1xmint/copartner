// Fails if rules.md outgrows its budget, the helper script doesn't parse, or
// any file carries personal details.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RULES_LIMIT = 4000; // bytes; read on every turn, so keep it small
const problems = [];

const rulesSize = statSync('rules.md').size;
if (rulesSize > RULES_LIMIT) problems.push(`rules.md is ${rulesSize} bytes, limit ${RULES_LIMIT}`);

const HELPER = 'skills/codex-partner/codex-partner.mjs';
try {
  execFileSync(process.execPath, ['--check', HELPER], { stdio: ['ignore', 'ignore', 'pipe'] });
} catch (e) {
  problems.push(`${HELPER} has a syntax error:
${e.stderr}`);
}

const personal = [
  [/[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s]+/, 'Windows home folder path'],
  [/\/(Users|home)\/[a-z0-9_.-]+/i, 'Mac or Linux home folder path'],
  [/[\w.+-]+@[\w-]+\.[\w.]+/, 'email address'],
];
const allowedEmails = /noreply@/;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else scan(path);
  }
}

function scan(path) {
  if (path === 'LICENSE') return;
  readFileSync(path, 'utf8').split('\n').forEach((line, i) => {
    for (const [re, what] of personal) {
      const m = line.match(re);
      if (m && !(what === 'email address' && allowedEmails.test(m[0]))) {
        problems.push(`${path}:${i + 1} has a ${what}`);
      }
    }
  });
}

walk('.');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`ok: rules.md ${rulesSize}/${RULES_LIMIT} bytes, helper parses, no personal details`);
