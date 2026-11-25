import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LINE, MAX_CHARS } from './horror.ts';

// Write one line of horror to /output/entry.txt.
// The sealed gate wants UTF-8 text of 1 to 200 characters that is not only
// whitespace, so validate the single sentence before writing it out. A line
// break would turn the one-liner into a paragraph, so the guard below also
// bans control characters (line feeds included) to keep it a single sentence.
const text = LINE;
const size = [...text].length;
if (size < 1 || size > MAX_CHARS) {
  throw new Error(`a horror line must be 1-${MAX_CHARS} characters, got ${size}`);
}
if (!text.trim() || text !== text.trim()) {
  throw new Error('the horror line must be non-blank and free of outer whitespace');
}
for (const ch of text) {
  const c = ch.charCodeAt(0);
  if (c < 0x20 || c === 0x7f || c === 0x2028 || c === 0x2029) {
    throw new Error('the horror line must stay on one line, with no control characters');
  }
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.txt');
writeFileSync(target, text, 'utf8');
chmodSync(target, 0o644);
console.log(`wrote a ${size}-character, single-line horror line to ${target}`);
