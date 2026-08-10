/**
 * Download Xenova/all-MiniLM-L6-v2 model files to local cache
 * with retry logic for flaky connections.
 */

import fs from 'fs';
import path from 'path';

const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';
const BASE_URL = `https://huggingface.co/${MODEL_ID}/resolve/main`;

// The cache directory that @xenova/transformers looks in
const CACHE_DIR = path.join(
  process.cwd(),
  'node_modules', '@xenova', 'transformers', '.cache', MODEL_ID
);

// Files needed for the model (ONNX quantized + tokenizer + config)
const FILES = [
  'config.json',
  'tokenizer.json',
  'tokenizer_config.json',
  'vocab.txt',
  'onnx/model_quantized.onnx',
];

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

async function downloadWithRetry(url, destPath, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const buf = Buffer.from(await resp.arrayBuffer());
      const dir = path.dirname(destPath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(destPath, buf);
      console.log(`  ✓ ${path.basename(destPath)} (${(buf.length / 1024).toFixed(1)} KB)`);
      return;
    } catch (err) {
      const code = err.cause?.code || err.message;
      if (attempt < retries) {
        console.log(`  ✗ attempt ${attempt}/${retries}: ${code} — retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      } else {
        throw new Error(`Failed after ${retries} attempts: ${code}`);
      }
    }
  }
}

async function main() {
  console.log(`Downloading ${MODEL_ID} to ${CACHE_DIR}\n`);

  for (const file of FILES) {
    const url = `${BASE_URL}/${file}`;
    const destPath = path.join(CACHE_DIR, file);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      const stat = fs.statSync(destPath);
      if (stat.size > 0) {
        console.log(`  SKIP ${file} (already exists, ${(stat.size / 1024).toFixed(1)} KB)`);
        continue;
      }
    }

    console.log(`  Downloading ${file}...`);
    await downloadWithRetry(url, destPath);
  }

  console.log('\nAll model files downloaded successfully!');
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
