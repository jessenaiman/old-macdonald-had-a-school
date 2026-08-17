import { getSongbookSong } from "../../../../../lib/songbook";
import { renderSongHybridMarkdown } from "../../../../../lib/hybrid-lessons";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const songId = Number(id);
  if (!Number.isInteger(songId)) return new Response("Not found", { status: 404 });

  const song = getSongbookSong(songId);
  if (!song) return new Response("Not found", { status: 404 });

  const filename = song.title
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return new Response(renderSongHybridMarkdown(song), {
    headers: {
      "Content-Disposition": `attachment; filename="${filename || `song-${songId}`}.md"`,
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
