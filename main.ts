// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the post itself: the meme (meme.png) is posted on X from a
// public account with make.fun and the play code in its text, POST.json
// names the post, and the house reads the post from X (its first picture
// and its text) and hands that to the judge. Nothing this program writes
// about the post is judged.
//
// This program copies POST.json from the repository root to /output,
// after checking it parses as a JSON object with a url string, so a
// broken placeholder fails loudly here instead of silently at the gate.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  console.error('POST.json must be a JSON object, got: ' + typeof parsed);
  process.exit(1);
}
const url = (parsed as Record<string, unknown>).url;
if (typeof url !== 'string' || url.length === 0) {
  console.error('POST.json must hold a non-empty url string');
  process.exit(1);
}
const X_POST = /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(i\/web\/status\/\d+|[^/]+\/(status|statuses)\/\d+)$/;
if (!X_POST.test(url)) {
  console.error('POST.json url must be an X post address, got: ' + url);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), JSON.stringify(parsed), 'utf8');
