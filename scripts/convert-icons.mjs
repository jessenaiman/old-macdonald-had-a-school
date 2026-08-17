import sharp from 'sharp';
import { stat, mkdir } from 'fs/promises';
import { join, basename } from 'path';

const SRC_DIR = 'docs/design-explorations/old-macdonald-icon-pack';
const OUT_DIR = 'public/design-assets/icon-pack-v1';

const SIZES = [512, 256, 128, 64, 32];
const QUALITY = 80;

// Production-relevant files only (skip -source-chroma.png, -master.png, pack-preview.jpg)
const PRODUCTION_FILES = [
  'app-mark-512.png',
  'favicon-16.png',
  'favicon-32.png',
  'favicon-64.png',
  'topic-language.png',
  'topic-math.png',
  'topic-music-movement.png',
  'topic-routines-regulation.png',
  'sticker-apple.png',
  'sticker-backpack.png',
  'sticker-boots.png',
  'sticker-handbell.png',
];

let totalInputBytes = 0;
let outputFiles = [];

async function main() {
  console.log('📦 Converting icon pack PNGs → WebP\n');

  await mkdir(OUT_DIR, { recursive: true });

  // Measure input sizes
  for (const fileName of PRODUCTION_FILES) {
    const srcPath = join(SRC_DIR, fileName);
    try {
      const s = await stat(srcPath);
      totalInputBytes += s.size;
      console.log(`  ${fileName.padEnd(30)} ${(s.size / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.warn(`⚠️  Not found: ${srcPath}`);
    }
  }
  console.log(`\n  Total source size: ${(totalInputBytes / 1024).toFixed(1)} KB\n`);

  // Convert each file at each size
  for (const fileName of PRODUCTION_FILES) {
    const srcPath = join(SRC_DIR, fileName);
    const nameWithoutExt = basename(fileName, '.png');

    for (const size of SIZES) {
      // Skip favicon-16 as source for 16px target (it IS already 16px)
      if (fileName === 'favicon-16.png' && size === 16) continue;

      const outFileName = `${nameWithoutExt}-${size}.webp`;
      const outPath = join(OUT_DIR, outFileName);

      await sharp(srcPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outPath);

      const outFileStat = await stat(outPath);
      outputFiles.push({
        path: `public/design-assets/icon-pack-v1/${outFileName}`,
        bytes: outFileStat.size,
      });
    }
  }

  // Report results
  const totalOutputBytes = outputFiles.reduce((sum, f) => sum + f.bytes, 0);
  const savings = totalInputBytes - totalOutputBytes;
  const savingsPercent = ((savings / totalInputBytes) * 100).toFixed(1);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('OUTPUT FILES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const f of outputFiles.sort((a, b) => a.path.localeCompare(b.path))) {
    console.log(`  ${f.path.padEnd(60)} ${(f.bytes / 1024).toFixed(1)} KB`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Files produced : ${outputFiles.length}`);
  console.log(`  Total input    : ${(totalInputBytes / 1024).toFixed(1)} KB (${(totalInputBytes / (1024*1024)).toFixed(2)} MB)`);
  console.log(`  Total output   : ${(totalOutputBytes / 1024).toFixed(1)} KB (${(totalOutputBytes / (1024*1024)).toFixed(2)} MB)`);
  console.log(`  Net change     : ${savings > 0 ? '-' : '+'}${Math.abs(savings / 1024).toFixed(1)} KB (${savingsPercent}%)`);
  console.log('\n✅ Done.\n');
}

main().catch(err => {
  console.error('❌ Conversion failed:', err.message);
  process.exit(1);
});
