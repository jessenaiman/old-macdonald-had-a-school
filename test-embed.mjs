// Reproduce the exact getEmbedder() path from app/api/search/route.ts
const { pipeline, env } = await import("@xenova/transformers");
env.allowRemoteModels = true;
env.allowLocalModels = true;
const t0 = Date.now();
try {
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  console.log(`Model loaded in ${((Date.now()-t0)/1000).toFixed(1)}s`);
  const out = await embedder("ponies lap rhymes", { pooling: "mean", normalize: true });
  const vec = Array.from(out.data);
  console.log(`Embedding dims: ${vec.length}`);
  console.log(`First 5 values: ${vec.slice(0,5).map(v=>v.toFixed(4)).join(", ")}`);
  console.log("EMBED_OK");
} catch (e) {
  console.error("EMBED_FAIL:", e.message);
  process.exit(1);
}