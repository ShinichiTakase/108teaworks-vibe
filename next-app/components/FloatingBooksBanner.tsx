"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  return (match ? match[1] : "ja") as Locale;
}

function buildLocalizedHref(locale: Locale, href: string): string {
  if (locale === "ja") return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

type BannerTextEntry = {
  book1Lead: string;
  book1Name: string;
  book2Lead: string;
  book2Name: string;
  authorRole: string;
  authorRoleLine2?: string;
  authorName: string;
  more: string;
};

const BANNER_TEXTS: Record<Locale, BannerTextEntry> = {
  ja: {
    book1Lead: "お茶を日常にする本",
    book1Name: "伊勢茶の歴史 お茶のおもしろ知識",
    book2Lead: "伝統の香りと歴史を綴る",
    book2Name: "伊勢茶発祥の地　川俣谷のお茶",
    more: "もっと読む",
    authorRole: "日本茶インストラクター",
    authorRoleLine2: "リーダー",
    authorName: "高瀬　孝二著",
  },
  en: {
    book1Lead: "Bringing tea into daily life",
    book1Name: "History of Ise Tea — Fun Facts About Tea",
    book2Lead: "Tradition, aroma & history",
    book2Name: "Tea of Kawamatadani, the birthplace of Ise tea",
    more: "Read more",
    authorRole: "Japanese Tea Instructor Leader",
    authorName: "Koji Takase",
  },
  ko: {
    book1Lead: "차를 일상으로",
    book1Name: "이세차의 역사·차의 재미있는 지식",
    book2Lead: "전통의 향과 역사",
    book2Name: "이세차 발상지 가와마타다니의 차",
    more: "더 보기",
    authorRole: "일본차 인스트럭터 리더",
    authorName: "다카세 고지 저",
  },
  zh: {
    book1Lead: "让茶走进日常",
    book1Name: "伊势茶历史与茶的趣味知识",
    book2Lead: "传统香气与历史",
    book2Name: "伊势茶发祥地 川俣谷之茶",
    more: "阅读更多",
    authorRole: "日本茶讲师领袖",
    authorName: "高濑孝二　著",
  },
};

/** 640px 以下の1行表示：肩書＋区切り（著者名は別要素で太字） */
function authorHeadlineRolePrefix(locale: Locale, t: BannerTextEntry): string {
  const role =
    t.authorRoleLine2 != null ? `${t.authorRole}${t.authorRoleLine2}` : t.authorRole;
  const gap = locale === "en" ? " · " : "\u3000";
  return `${role}${gap}`;
}

export default function FloatingBooksBanner() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const t = BANNER_TEXTS[locale];
  const href1 = buildLocalizedHref(locale, "/isecha_no_rekishi");
  const href2 = buildLocalizedHref(locale, "/kabatadani_no_ocha");

  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry?.isIntersecting ?? false);
      },
      { threshold: 0, rootMargin: "0px" },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const bookLeadClass =
    "block w-full text-right text-[0.65rem] font-normal leading-tight text-ink max-[639px]:text-[0.62rem] min-[640px]:text-[0.75rem] md:text-[0.8125rem]";
  const bookNameRowClass =
    "flex w-full items-start justify-end gap-1 max-[639px]:gap-0.5 min-[640px]:items-center";
  const bookNameClass =
    "min-w-0 text-right text-[0.8125rem] font-bold leading-tight text-tea-deep max-[639px]:text-[0.78rem] min-[640px]:text-[0.9375rem] md:text-base";
  const bookNameBulletClass =
    "mt-0.5 h-4 w-auto shrink-0 object-contain opacity-90 max-[639px]:h-3.5 min-[640px]:mt-0 min-[640px]:h-5";
  const moreLinkClass =
    "inline-block text-right text-tea-deep underline underline-offset-2 hover:text-tea-deeper text-[0.8125rem] leading-tight font-medium";
  const authorRoleClass =
    "block w-full text-left text-[0.65rem] font-normal leading-snug text-ink-muted break-keep sm:text-[0.7rem] md:text-[0.75rem]";
  const authorNameClass =
    "mt-0.5 block w-full text-left text-[0.8125rem] font-bold leading-snug text-ink break-keep sm:text-[0.875rem] md:text-[0.9375rem]";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out ${
        footerVisible ? "pointer-events-none translate-y-full" : "translate-y-0"
      }`}
      role="region"
      aria-label={
        locale === "ja"
          ? "高瀬孝二著の電子書籍へのリンク"
          : "Links to e-books by Koji Takase"
      }
    >
      <div className="border-t-2 border-tea-deep/25 bg-gradient-to-b from-washi via-cream to-[#e8e3d9] shadow-[0_-8px_28px_rgba(45,55,40,0.09)] backdrop-blur-sm [writing-mode:horizontal-tb]">
        <div className="mx-auto flex max-w-wide flex-col items-stretch gap-2 py-2 pl-2 pr-24 min-[640px]:flex-row min-[640px]:flex-nowrap min-[640px]:items-center sm:gap-3 sm:pl-3 sm:pr-28 md:gap-4 md:pl-4 md:pr-32">
          <div className="hidden shrink-0 md:flex md:items-center">
            <Image
              src="/images/books/Organization.png"
              alt=""
              width={88}
              height={72}
              className="h-12 w-auto max-w-[5.5rem] object-contain object-center opacity-95"
            />
          </div>

          <div className="w-full min-w-0 flex-1 basis-auto py-0 min-[640px]:basis-0">
            <p className="m-0 mb-2 px-0.5 text-center text-[0.68rem] leading-tight break-keep min-[640px]:hidden">
              <span className="font-normal text-ink-muted">
                {authorHeadlineRolePrefix(locale, t)}
              </span>
              <span className="font-bold text-ink">{t.authorName}</span>
            </p>

            <div className="flex flex-row items-stretch gap-2 min-[640px]:items-end min-[640px]:gap-4 md:gap-6">
              <div className="min-w-0 flex-1 border-r border-border/70 pr-2 min-[640px]:border-tea-deep/15 min-[640px]:pr-4 md:pr-6">
                <div className="flex flex-col items-end gap-1">
                  <Link
                    href={href1}
                    target="_self"
                    className="flex w-full flex-col items-end gap-0.5 no-underline hover:opacity-90"
                  >
                    <span className={bookLeadClass}>{t.book1Lead}</span>
                    <span className={bookNameRowClass}>
                      <Image
                        src="/images/books/leef.jpg"
                        alt=""
                        width={194}
                        height={192}
                        className={bookNameBulletClass}
                        aria-hidden
                      />
                      <span className={bookNameClass}>{t.book1Name}</span>
                    </span>
                  </Link>
                  <p className="m-0 w-full text-right leading-tight">
                    <Link href={href1} target="_self" className={moreLinkClass}>
                      {t.more}
                    </Link>
                  </p>
                </div>
              </div>
              <div className="min-w-0 flex-1 min-[640px]:flex-[1.15] min-[640px]:border-r min-[640px]:border-tea-deep/15 min-[640px]:pr-4 md:pr-6">
                <div className="flex flex-col items-end gap-1">
                  <Link
                    href={href2}
                    target="_self"
                    className="flex w-full flex-col items-end gap-0.5 no-underline hover:opacity-90"
                  >
                    <span className={bookLeadClass}>{t.book2Lead}</span>
                    <span className={bookNameRowClass}>
                      <Image
                        src="/images/books/leef.jpg"
                        alt=""
                        width={194}
                        height={192}
                        className={bookNameBulletClass}
                        aria-hidden
                      />
                      <span className={bookNameClass}>{t.book2Name}</span>
                    </span>
                  </Link>
                  <p className="m-0 w-full text-right leading-tight">
                    <Link href={href2} target="_self" className={moreLinkClass}>
                      {t.more}
                    </Link>
                  </p>
                </div>
              </div>
              <p className="m-0 hidden min-w-0 w-full shrink-0 min-[640px]:block min-[640px]:w-auto min-[640px]:min-w-[11rem] min-[640px]:max-w-[15rem]">
                {t.authorRoleLine2 != null ? (
                  <>
                    <span className={authorRoleClass}>{t.authorRole}</span>
                    <span className={authorRoleClass}>{t.authorRoleLine2}</span>
                  </>
                ) : (
                  <span className={authorRoleClass}>{t.authorRole}</span>
                )}
                <span className={authorNameClass}>{t.authorName}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
