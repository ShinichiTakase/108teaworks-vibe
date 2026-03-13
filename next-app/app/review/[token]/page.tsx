import { notFound } from "next/navigation";
import { findActiveToken } from "@/lib/reviewsStorage";
import type { Locale } from "@/lib/i18n";

type Props = {
  params: { token: string };
};

export const dynamic = "force-dynamic";

const LOCALE_LABELS: Record<
  Locale,
  { title: string; nickname: string; nicknameOptional: string; rating: string; review: string; reviewOptional: string; submit: string }
> = {
  ja: {
    title: "商品レビューのご協力をお願いします",
    nickname: "ニックネーム",
    nicknameOptional: "（任意）",
    rating: "評価（5点満点）",
    review: "レビュー",
    reviewOptional: "（任意）",
    submit: "レビューを送信する",
  },
  en: {
    title: "Please review your purchase",
    nickname: "Nickname",
    nicknameOptional: "(optional)",
    rating: "Rating (out of 5)",
    review: "Review",
    reviewOptional: "(optional)",
    submit: "Submit review",
  },
  ko: {
    title: "구매하신 상품을 평가해 주세요",
    nickname: "닉네임",
    nicknameOptional: "(선택)",
    rating: "평점 (5점 만점)",
    review: "리뷰",
    reviewOptional: "(선택)",
    submit: "리뷰 제출",
  },
  zh: {
    title: "请为本次购买留下评价",
    nickname: "昵称",
    nicknameOptional: "（选填）",
    rating: "评分（满分5分）",
    review: "评价",
    reviewOptional: "（选填）",
    submit: "提交评价",
  },
};

export default async function ReviewPage({ params }: Props) {
  const token = params.token;
  const record = await findActiveToken(token);
  if (!record) {
    notFound();
  }

  const locale: Locale = ["ja", "en", "ko", "zh"].includes(record.locale) ? record.locale : "ja";
  const labels = LOCALE_LABELS[locale];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="m-0 mb-6 text-xl font-semibold text-tea-deep">{labels.title}</h1>
      <form
        className="space-y-8"
        method="post"
        action={`/api/reviews/submit?token=${encodeURIComponent(token)}`}
      >
        <section className="border border-border rounded-xl p-4 bg-washi">
          <label className="block mb-1 text-[0.875rem] text-ink">
            {labels.nickname}
            <span className="text-ink/70 font-normal ml-1">{labels.nicknameOptional}</span>
            <input
              type="text"
              name="nickname"
              className="mt-1 w-full rounded border border-border px-3 py-2 text-[0.9375rem]"
            />
          </label>
        </section>
        {record.items.map((item, index) => (
          <section key={item.slug + index} className="border border-border rounded-xl p-4 bg-washi">
            <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">{item.title}</h2>
            <input type="hidden" name={`items[${index}][slug]`} value={item.slug} />
            <input type="hidden" name={`items[${index}][title]`} value={item.title} />
            <div className="mb-3">
              <label className="block mb-1 text-[0.875rem] text-ink">
                {labels.rating}
                <span className="text-red-600 ml-0.5" aria-hidden>*</span>
                <select
                  name={`items[${index}][rating]`}
                  defaultValue="5"
                  required
                  className="mt-1 w-24 rounded border border-border px-2 py-1 text-[0.9375rem]"
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label className="block mb-1 text-[0.875rem] text-ink">
                {labels.review}
                <span className="text-ink/70 font-normal ml-1">{labels.reviewOptional}</span>
                <textarea
                  name={`items[${index}][review]`}
                  rows={4}
                  className="mt-1 w-full rounded border border-border px-3 py-2 text-[0.9375rem]"
                />
              </label>
            </div>
          </section>
        ))}
        <button
          type="submit"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold hover:bg-tea-light hover:border-tea-light transition-colors"
        >
          {labels.submit}
        </button>
      </form>
    </main>
  );
}

