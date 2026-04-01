import fs from "node:fs";

const filePath = process.argv[2];
if (!filePath) {
  console.error("usage: node scripts/print-seo-tags.mjs <html-file>");
  process.exit(2);
}

const html = fs.readFileSync(filePath, "utf8");

function pickAttr(chunk, attrName) {
  const key = `${attrName}="`;
  const i = chunk.indexOf(key);
  if (i === -1) return null;
  const j = chunk.indexOf('"', i + key.length);
  if (j === -1) return null;
  return chunk.slice(i + key.length, j);
}

function findFirstTag(rel) {
  const token = `rel="${rel}"`;
  const i = html.indexOf(token);
  if (i === -1) return null;
  const chunk = html.slice(i, i + 1200);
  return {
    href: pickAttr(chunk, "href"),
    hreflang: pickAttr(chunk, "hreflang"),
  };
}

function findAllAlternateTags() {
  const out = [];
  let pos = 0;
  const token = 'rel="alternate"';
  while (true) {
    const i = html.indexOf(token, pos);
    if (i === -1) break;
    const chunk = html.slice(i, i + 1600);
    const hreflang = pickAttr(chunk, "hreflang");
    const href = pickAttr(chunk, "href");
    if (hreflang && href) out.push({ hreflang, href });
    pos = i + token.length;
  }
  return out;
}

const canonical = findFirstTag("canonical")?.href ?? "(not found)";
console.log("canonical:", canonical);

const alts = findAllAlternateTags();
console.log("alternates:", alts.length);
for (const a of alts) {
  console.log(`- ${a.hreflang}: ${a.href}`);
}

// Debug: some environments output "hrefLang" instead of "hreflang"
const hrefLangIdx = html.indexOf('hrefLang="');
if (hrefLangIdx !== -1) {
  const snippet = html.slice(Math.max(0, hrefLangIdx - 120), hrefLangIdx + 300);
  console.log("hrefLang snippet:", snippet);
}

