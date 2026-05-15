import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content", "isecha_no_rekishi");

export type ChapterMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  order: number;
  description: string;
};

export type Chapter = ChapterMeta & {
  contentHtml: string;
};

export function getAllChapterMetas(): ChapterMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const metas = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    return data as ChapterMeta;
  });
  return metas.sort((a, b) => a.order - b.order);
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkHtml).process(content);
  return {
    ...(data as ChapterMeta),
    contentHtml: processed.toString(),
  };
}

export function getAdjacentChapters(slug: string): {
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
} {
  const all = getAllChapterMetas();
  const idx = all.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function getAllChapterSlugs(): string[] {
  return getAllChapterMetas().map((c) => c.slug);
}
