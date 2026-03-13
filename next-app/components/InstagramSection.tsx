import { fetchInstagramMedia } from "@/lib/instagram";
import type { Locale } from "@/lib/i18n";
import { HOME_INSTAGRAM_TEXTS } from "@/lib/homeSectionTexts";

const FALLBACK_POSTS = [
  { url: "https://www.instagram.com/p/DVK0TbkkbiJ/", img: "/images/instagram/post-01.jpg" },
  { url: "https://www.instagram.com/p/DUx6ohyEawL/", img: "/images/instagram/post-02.jpg" },
  { url: "https://www.instagram.com/p/DUsMdGJEU5u/", img: "/images/instagram/post-03.jpg" },
  { url: "https://www.instagram.com/p/DUnWV1Jke7G/", img: "/images/instagram/post-04.jpg" },
  { url: "https://www.instagram.com/p/DS11zPGkZoU/", img: "/images/instagram/post-05.jpg" },
  { url: "https://www.instagram.com/p/DR4VZTgEQPM/", img: "/images/instagram/post-06.jpg" },
  { url: "https://www.instagram.com/p/DQgS093EXJG/", img: "/images/instagram/post-07.jpg" },
  { url: "https://www.instagram.com/p/DQTY-TWkVWA/", img: "/images/instagram/post-08.jpg" },
  { url: "https://www.instagram.com/p/DQHYqH3kpcH/", img: "/images/instagram/post-09.jpg" },
  { url: "https://www.instagram.com/p/DOHoNDhklII/", img: "/images/instagram/post-10.jpg" },
];

type Props = { locale?: Locale };

export default async function InstagramSection({ locale = "ja" }: Props) {
  const media = await fetchInstagramMedia(10);
  const posts =
    media.length > 0
      ? media.map((m) => ({
          url: m.permalink,
          img: m.thumbnail_url || m.media_url,
        }))
      : FALLBACK_POSTS;
  const t = HOME_INSTAGRAM_TEXTS[locale];

  return (
    <section
      className="mb-12"
      id="instagram"
      aria-labelledby="instagram-heading"
    >
      <h2
        id="instagram-heading"
        className="m-0 mb-4 font-heading text-lg font-semibold text-tea-deep"
      >
        {t.heading}
      </h2>
      <p className="m-0 text-[0.9375rem] text-ink-muted">
        <a
          href="https://www.instagram.com/108teaworks/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-tea no-underline hover:underline"
        >
          @108teaworks
        </a>
        {" "}{t.intro}
      </p>
      <ul
        className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-4 list-none m-0 p-0"
        aria-label={t.postsAria}
      >
        {posts.map((post) => (
          <li key={post.url} className="m-0">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square overflow-hidden rounded bg-washi"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.img}
                alt={t.postAlt}
                width={200}
                height={200}
                className="block w-full h-full object-cover"
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center">
        <a
          href="https://www.instagram.com/108teaworks/"
          className="inline-block py-4 px-8 text-[0.9375rem] font-medium bg-transparent text-tea-deep border border-tea-deep rounded no-underline transition-colors hover:bg-tea-deep hover:text-cream focus:outline-2 focus:outline-tea-light focus:outline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.followCta}
        </a>
      </p>
    </section>
  );
}
