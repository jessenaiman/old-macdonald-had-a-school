// Build data/search-vectors.db — a writable sidecar holding one float32[384]
// embedding per search_chunks row of the READ-ONLY data/omhas.db.
//
//   node scripts/db/build-search-embeddings.mjs
//
// Idempotent: chunks already present in the sidecar are skipped, so re-runs
// only embed new rows (0 on a complete database). Weights are downloaded once
// into models/Xenova/all-MiniLM-L6-v2 (gitignored) and mirrored to
// models/all-MiniLM-L6-v2 so the runtime query embedder never touches the HF
// CDN (app/api/search/route.ts loads from that dir with remote models off).

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pipeline, env } from "@xenova/transformers";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SOURCE_DB = process.env.OMHAS_DB_PATH
  ? path.resolve(process.env.OMHAS_DB_PATH)
  : path.join(ROOT, "data", "omhas.db");
const SIDECAR_DB = path.join(ROOT, "data", "search-vectors.db");
const MODELS_DIR = path.join(ROOT, "models");

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const LOCAL_MODEL_ID = "all-MiniLM-L6-v2";
// Files the feature-extraction pipeline needs at load time; mirrored from the
// HF cache layout into a plain local-models directory for runtime use.
const MODEL_FILES = [
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  path.join("onnx", "model_quantized.onnx"),
];

const BATCH_SIZE = 64;
const PROGRESS_EVERY = 200;

env.cacheDir = MODELS_DIR;

function embedText(row) {
  const body = row.chunk_text ?? "";
  return `${row.title}\n${body}`.slice(0, 8000);
}

async function main() {
  console.log(`source db : ${SOURCE_DB} (readonly)`);
  console.log(`sidecar db: ${SIDECAR_DB}`);

  const source = new Database(SOURCE_DB, { readonly: true, fileMustExist: true });
  fs.mkdirSync(path.dirname(SIDECAR_DB), { recursive: true });
  const vectors = new Database(SIDECAR_DB);
  vectors.exec(`
    CREATE TABLE IF NOT EXISTS embeddings (
      chunk_id TEXT PRIMARY KEY,
      embedding BLOB NOT NULL
    )
  `);

  const done = new Set(
    vectors.prepare("SELECT chunk_id FROM embeddings").all().map((r) => r.chunk_id),
  );
  const rows = source.prepare("SELECT id, title, chunk_text FROM search_chunks").all();
  const pending = rows.filter((r) => !done.has(r.id));
  console.log(`chunks    : ${rows.length} total, ${done.size} already embedded, ${pending.length} to embed`);

  if (pending.length > 0) {
    // First run downloads weights into ${MODELS_DIR}/Xenova/all-MiniLM-L6-v2;
    // later runs hit the local cache and need no network.
    console.log("loading embedder (first run downloads ~25MB int8 weights)…");
    const embedder = await pipeline("feature-extraction", MODEL_ID, { quantized: true });
    mirrorWeightsToLocalModelsDir();

    const insert = vectors.prepare("INSERT OR REPLACE INTO embeddings (chunk_id, embedding) VALUES (?, ?)");
    let processed = 0;
    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
      const batch = pending.slice(i, i + BATCH_SIZE);
      const texts = batch.map(embedText);
      const output = await embedder(texts, { pooling: "mean", normalize: true });
      const dims = output.dims;
      const runInsert = vectors.transaction(() => {
        for (let j = 0; j < batch.length; j++) {
          const offset = j * dims[1];
          const vec = output.data.subarray(offset, offset + dims[1]);
          insert.run(batch[j].id, Buffer.from(vec.buffer, vec.byteOffset, vec.byteLength));
        }
      });
      runInsert();
      processed += batch.length;
      if (processed % PROGRESS_EVERY < BATCH_SIZE || processed === pending.length) {
        console.log(`embedded ${processed}/${pending.length}`);
      }
    }
  }

  const finalCount = vectors.prepare("SELECT count(*) AS c FROM embeddings").get().c;
  console.log(`done: ${finalCount} embeddings in sidecar`);
  source.close();
  vectors.close();
}

// Mirror cached weights to models/<LOCAL_MODEL_ID>/ so the dev-server/prod
// query embedder can load with `allowRemoteModels=false`.
function mirrorWeightsToLocalModelsDir() {
  const cacheBase = path.join(MODELS_DIR, ...MODEL_ID.split("/"));
  const localBase = path.join(MODELS_DIR, LOCAL_MODEL_ID);
  let missing = false;
  for (const rel of MODEL_FILES) {
    const dest = path.join(localBase, rel);
    if (!fs.existsSync(dest)) {
      missing = true;
      break;
    }
  }
  if (!missing) return;
  for (const rel of MODEL_FILES) {
    const src = path.join(cacheBase, rel);
    const dest = path.join(localBase, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`mirrored ${rel}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
