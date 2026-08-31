import Image from "next/image";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { ISECHA_HOW_TO_BREW, type HowToBrewBlock } from "@/lib/isechaHowToBrewContent";

function renderBlock(block: HowToBrewBlock, i: number) {
  switch (block.type) {
    case "p":
      return (
        <p
          key={i}
          className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted last:mb-0"
        >
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          key={i}
          className="mt-8 mb-3 text-base font-semibold text-tea-deep first:mt-0"
        >
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul
          key={i}
          className="mb-4 list-disc space-y-1 pl-5 text-[0.9375rem] leading-relaxed text-ink-muted"
        >
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={i} className="mb-4 overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse text-left text-[0.875rem] text-ink-muted">
            <thead>
              <tr className="border-b border-tea-light/50 bg-cream/60">
                <th className="px-2 py-2 font-semibold text-tea-deep">
                  {block.headers[0]}
                </th>
                <th className="px-2 py-2 font-semibold text-tea-deep">
                  {block.headers[1]}
                </th>
                <th className="px-2 py-2 font-semibold text-tea-deep">
                  {block.headers[2]}
                </th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border/80">
                  <td className="px-2 py-2 align-top">{row[0]}</td>
                  <td className="px-2 py-2 align-top">{row[1]}</td>
                  <td className="px-2 py-2 align-top">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function IsechaHowToBrewPage() {
  const doc = ISECHA_HOW_TO_BREW;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav current="howToBrew" />
          <h1 className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep">
            {doc.h1}
          </h1>

          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10">
            <div className="min-w-0 text-left">
              {doc.blocks.map((block, i) => renderBlock(block, i))}
            </div>
            <div className="flex justify-end">
              <figure className="m-0 w-full max-w-md shrink-0 overflow-hidden rounded-md">
                <Image
                  src="/images/how-to-brew/top.webp"
                  alt={doc.imageAlt}
                  width={1200}
                  height={800}
                  priority
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 28rem"
                />
              </figure>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
