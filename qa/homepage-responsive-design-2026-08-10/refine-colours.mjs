import sharp from "sharp";
import { resolve } from "node:path";

const root = resolve("qa/homepage-responsive-design-2026-08-10");
const colors = ["#C9527A","#1F6B6B","#55705A","#2C6C9B","#4F5FA0","#B5272C"];
const layouts = {
  "desktop-1440.png": [[113,611,392,153],[524,611,393,153],[935,611,392,153],[113,783,392,153],[524,783,393,153],[935,783,392,153]],
  "mid-768.png": [[53,632,323,151],[393,632,323,151],[53,800,323,151],[393,800,323,151],[53,968,323,151],[393,968,323,151]],
  "mobile-390.png": [[25,782,322,121],[25,916,322,121],[25,1050,322,121],[25,1184,322,121],[25,1318,322,121],[25,1452,322,121]],
};
for (const [file, rects] of Object.entries(layouts)) {
  const input = resolve(root,file);
  const overlays = rects.map(([left,top,width,height],i) => ({
    input: Buffer.from(`<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="24" fill="${colors[i]}" fill-opacity=".56"/></svg>`),
    left, top, blend: "overlay"
  }));
  const tmp = resolve(root,`refined-${file}`);
  await sharp(input).composite(overlays).png().toFile(tmp);
  await sharp(tmp).png().toFile(input);
}
