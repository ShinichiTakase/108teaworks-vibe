#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextAppDir = path.join(__dirname, '..');
const projectRoot = path.join(nextAppDir, '..');
const outputDir = path.join(projectRoot, 'mie_chagyo_shi');
const contentDir = path.join(nextAppDir, 'content', 'mie_chagyo_shi');
const fs_content = fs.promises;

// Get all chapter data
async function getAllChapters() {
  const files = await fs_content.readdir(contentDir);
  const mdFiles = files.filter(f => f.endsWith('.md')).sort();
  
  const chapters = [];
  for (const file of mdFiles) {
    const raw = await fs_content.readFile(path.join(contentDir, file), 'utf8');
    const { data } = matter(raw);
    chapters.push({
      slug: file.replace('.md', ''),
      ...data
    });
  }
  
  return chapters.sort((a, b) => a.order - b.order);
}

// Process markdown to HTML
async function markdownToHtml(markdown) {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  
  let html = processed.toString();
  
  // Convert image paths from absolute to relative
  html = html.replace(/src="\/images\/mie_chagyo_shi\//g, 'src="images/');
  html = html.replace(/src="\/images\/books\//g, 'src="images/');
    // Center paragraphs containing images
  html = html.replace(/<p>(<img[^>]*>)<\/p>/g, '<p style="text-align: center;">$1</p>');
  
  // Add inline centering style to all img tags
  html = html.replace(/<img([^>]*?)>/g, '<img$1 style="display: block; margin-left: auto; margin-right: auto; max-width: 100%; height: auto;">');
  
    return html;
}

// Get adjacent chapters (prev/next)
function getAdjacentChapters(chapters, slug) {
  const idx = chapters.findIndex(c => c.slug === slug);
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  };
}

// Load CSS files
async function loadCss() {
  try {
    // Try to load Tailwind CSS from Next.js build output first
    const tailwindPath = path.join(nextAppDir, '.next', 'static', 'css', 'app', 'layout.css');
    console.log(`  Checking for Tailwind CSS at: ${tailwindPath}`);
    
    if (fs.existsSync(tailwindPath)) {
      console.log('  Loading Tailwind CSS from Next.js build...');
      const tailwind = await fs_content.readFile(tailwindPath, 'utf8');
      
      // Also load custom styles
      const customPath = path.join(projectRoot, 'css', 'style.css');
      let custom = '';
      if (fs.existsSync(customPath)) {
        custom = await fs_content.readFile(customPath, 'utf8');
      }
      
      return tailwind + '\n' + custom;
    } else {
      // Fallback to custom styles only
      console.log('  Using custom CSS only (Tailwind build not found)...');
      const customPath = path.join(projectRoot, 'css', 'style.css');
      if (fs.existsSync(customPath)) {
        return await fs_content.readFile(customPath, 'utf8');
      }
      return '';
    }
  } catch (e) {
    console.warn('Warning: Could not load CSS files', e.message);
    return '';
  }
}

// Main export function
async function exportMieChaGyoShi() {
  console.log('Starting mie_chagyo_shi static export...');
  console.log(`Output directory: ${outputDir}\n`);
  
  try {
    // Get all chapters
    const chapters = await getAllChapters();
    console.log(`Found ${chapters.length} chapters\n`);
    
    // Load CSS
    const cssContent = await loadCss();
    
    // Create output directories
    await fs_content.mkdir(outputDir, { recursive: true });
    await fs_content.mkdir(path.join(outputDir, 'css'), { recursive: true });
    await fs_content.mkdir(path.join(outputDir, 'js'), { recursive: true });
    await fs_content.mkdir(path.join(outputDir, 'images'), { recursive: true });
    
    // Process each chapter
    console.log('Processing chapters:');
    for (const chapter of chapters) {
      const filePath = path.join(contentDir, `${chapter.slug}.md`);
      const raw = await fs_content.readFile(filePath, 'utf8');
      const { content } = matter(raw);
      
      // Convert markdown to HTML
      const contentHtml = await markdownToHtml(content);
      
      // Get adjacent chapters
      const { prev, next } = getAdjacentChapters(chapters, chapter.slug);
      
      // Generate navigation HTML
      const navTop = `
      <nav aria-label="前後の章（上）" class="mb-8 flex items-center justify-between gap-4 border-b border-border pb-4">
        <div class="min-w-0 flex-1">
          ${prev ? `
            <a href="${prev.slug === 'cover' ? 'index.htm' : `${prev.slug}.htm`}" class="group flex flex-col gap-0.5 text-left">
              <span class="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">◀ 前の章</span>
              <span class="hidden truncate text-[0.875rem] text-ink group-hover:text-tea-deep sm:block">${prev.shortTitle}</span>
            </a>
          ` : '<span />'}
        </div>
        <a href="toc.htm" class="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep">目次</a>
        <div class="min-w-0 flex-1 text-right">
          ${next ? `
            <a href="${next.slug === 'cover' ? 'index.htm' : `${next.slug}.htm`}" class="group flex flex-col items-end gap-0.5">
              <span class="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">次の章 ▶</span>
              <span class="hidden truncate text-[0.875rem] text-ink group-hover:text-tea-deep sm:block">${next.shortTitle}</span>
            </a>
          ` : '<span />'}
        </div>
      </nav>`;
      
      const navBottom = `
      <nav aria-label="前後の章（下）" class="mt-12 flex items-center justify-between gap-4 border-t border-border pt-4">
        <div class="min-w-0 flex-1">
          ${prev ? `
            <a href="${prev.slug === 'cover' ? 'index.htm' : `${prev.slug}.htm`}" class="group flex flex-col gap-0.5">
              <span class="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">◀ 前の章</span>
              <span class="text-[0.875rem] text-ink group-hover:text-tea-deep">${prev.shortTitle}</span>
            </a>
          ` : '<span />'}
        </div>
        <a href="toc.htm" class="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep">目次</a>
        <div class="min-w-0 flex-1 text-right">
          ${next ? `
            <a href="${next.slug === 'cover' ? 'index.htm' : `${next.slug}.htm`}" class="group flex flex-col items-end gap-0.5">
              <span class="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">次の章 ▶</span>
              <span class="text-[0.875rem] text-ink group-hover:text-tea-deep">${next.shortTitle}</span>
            </a>
          ` : '<span />'}
        </div>
      </nav>`;
      
      // Create main HTML structure
      const mainHtml = `<main class="pt-10 pb-28 px-4 md:pt-16 md:pb-36" id="main-content" role="main">
        <div class="w-full max-w-2xl mx-auto">
          ${navTop}
          <article class="mb-12 prose prose-sm max-w-none">
            ${contentHtml}
          </article>
          ${navBottom}
        </div>
      </main>`;
      
      // Create complete HTML
      const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chapter.shortTitle}｜三重県茶業史</title>
    <style>
${cssContent}
    </style>
</head>
<body>
    ${mainHtml}
</body>
</html>`;
      
      // Determine output filename
      const filename = chapter.slug === 'cover' ? 'index.htm' : `${chapter.slug}.htm`;
      const outPath = path.join(outputDir, filename);
      
      await fs_content.writeFile(outPath, html, 'utf8');
      console.log(`  ✓ ${filename} (${chapter.shortTitle})`);
    }
    
    // Generate TOC page
    console.log('\nGenerating TOC page...');
    
    const cover = chapters.find(c => c.order === -1);
    const preface = chapters.find(c => c.order === 0);
    const ch01Secs = chapters.filter(c => c.order >= 1 && c.order <= 3);
    const mainChaps = chapters.filter(c => c.order >= 4);
    
    const tocContent = `<main class="pt-10 pb-28 px-4 md:pt-16 md:pb-36" id="main-content" role="main">
      <div class="w-full max-w-2xl mx-auto">
        <section class="mb-12">
          <h1 class="m-0 mb-1 font-heading text-xl font-semibold text-tea-deep">三重県茶業史</h1>
          <nav aria-label="目次" class="mb-10 mt-4">
            <h2 class="mb-4 text-[0.9375rem] font-semibold text-tea-deep">目次</h2>
            <ol class="space-y-1">
              <li><a href="${cover.slug === 'cover' ? 'index.htm' : `${cover.slug}.htm`}" class="group flex items-baseline gap-2 rounded-md px-3 py-2 text-[0.9375rem] text-ink hover:bg-washi hover:text-tea-deep">${cover.shortTitle}</a></li>
              <li><a href="${preface.slug}.htm" class="group flex items-baseline gap-2 rounded-md px-3 py-2 text-[0.9375rem] text-ink hover:bg-washi hover:text-tea-deep"><span class="text-[0.8125rem] text-ink-muted">序</span><span>${preface.shortTitle}</span></a></li>
              <li>
                <span class="flex items-baseline gap-2 px-3 py-2 text-[0.9375rem] font-semibold text-tea-deep">第一章　三重県茶業の沿革</span>
                <ol class="ml-6 space-y-0.5">
                  ${ch01Secs.map(sec => `<li><a href="${sec.slug}.htm" class="group flex items-baseline gap-2 rounded-md px-3 py-1.5 text-[0.9375rem] text-ink hover:bg-washi hover:text-tea-deep">${sec.shortTitle}</a></li>`).join('')}
                </ol>
              </li>
              ${mainChaps.map(ch => `<li><a href="${ch.slug}.htm" class="group flex items-baseline gap-2 rounded-md px-3 py-2 text-[0.9375rem] text-ink hover:bg-washi hover:text-tea-deep">${ch.shortTitle}</a></li>`).join('')}
            </ol>
          </nav>
        </section>
      </div>
    </main>`;
    
    const tocHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>目次｜三重県茶業史</title>
    <style>
${cssContent}
    </style>
</head>
<body>
    ${tocContent}
</body>
</html>`;
    
    await fs_content.writeFile(path.join(outputDir, 'toc.htm'), tocHtml, 'utf8');
    console.log('  ✓ toc.htm (目次)');
    
    // Copy CSS files
    console.log('\nCopying CSS files...');
    const cssSrcDir = path.join(projectRoot, 'css');
    const cssDstDir = path.join(outputDir, 'css');
    try {
      const cssFiles = await fs_content.readdir(cssSrcDir);
      for (const file of cssFiles) {
        if (file.endsWith('.css')) {
          const src = path.join(cssSrcDir, file);
          const dst = path.join(cssDstDir, file);
          await fs_content.copyFile(src, dst);
          console.log(`  ✓ ${file}`);
        }
      }
    } catch (e) {
      console.log('  ! CSS directory not found or error occurred');
    }
    
    // Copy image files
    console.log('\nCopying image files...');
    const imgSrcDirs = [
      path.join(projectRoot, 'images', 'mie_chagyo_shi'),
      path.join(nextAppDir, 'public', 'images', 'mie_chagyo_shi')
    ];
    
    const copyRecursive = async (src, dst) => {
      const stat = await fs_content.stat(src);
      if (stat.isDirectory()) {
        await fs_content.mkdir(dst, { recursive: true });
        const items = await fs_content.readdir(src);
        for (const item of items) {
          await copyRecursive(path.join(src, item), path.join(dst, item));
        }
      } else {
        await fs_content.copyFile(src, dst);
      }
    };
    
    for (const imgSrcDir of imgSrcDirs) {
      if (fs.existsSync(imgSrcDir)) {
        try {
          await copyRecursive(imgSrcDir, path.join(outputDir, 'images'));
          console.log(`  ✓ Copied images from ${path.basename(path.dirname(imgSrcDir))}`);
          break;
        } catch (e) {
          console.log(`  ! Error copying from ${imgSrcDir}`);
        }
      }
    }
    
    console.log('\n✅ Export completed successfully!');
    console.log(`📁 Output: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run
exportMieChaGyoShi();
