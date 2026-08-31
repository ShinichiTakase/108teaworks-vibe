import Image from "next/image";
import Link from "next/link";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { withTrailingSlashPath } from "@/lib/urlPath";

export const ISECHA_TEXTS: {
    h1: string;
    intro: string;
    bookMieTitle: string;
    bookMieP1: string;
    bookMieP2: string;
    bookMieLinkText: string;
    altMieCover: string;
    bookMieNoticeBefore: string;
    bookMieNoticeLinkText: string;
    bookMieNoticeAfter: string;
    bookHistoryTitle: string;
    bookHistoryP1: string;
    bookHistoryP2: string;
    bookHistoryLinkText: string;
    altHistoryCover: string;
    bookKawamataTitle: string;
    bookKawamataP1: string;
    bookKawamataP2: string;
    bookKawamataLinkText: string;
    authorBio: string;
    sec2Title1: string;
    sec2P1: string;
    sec2Title2: string;
    sec2P2: string;
    sec2FeatureList: string[];
    cardTitle: string;
    cardBody: string;
    sec3Title: string;
    sec3P1: string;
    sec3P2: string;
    sec3P3: string;
    sec4Title: string;
    sec4Heian: string;
    sec4Edo: string;
    sec4Meiji: string;
    sec5Title: string;
    sec5P1: string;
    sec5P2: string;
    sec5P3: string;
    cardHojichaTitle: string;
    cardHojichaBody: string;
    cardWakochaTitle: string;
    cardWakochaBody: string;
    altKawamata: string;
    altField: string;
} = {
    h1: "伊勢茶とは",
    intro:
      "伊勢茶は、三重県内で生産されるお茶の総称として親しまれているブランド名です。その歴史は古く、江戸時代には既に「伊勢国（現在の三重県）」の特産品として広く栽培されていました。現在では三重県全域が産地となっており、地域の豊かな風土がその深い味わいを育んでいます。",
    bookMieTitle: "三重県茶業史",
    bookMieP1:
      "三重県茶業会議所設立50周年記念として刊行された「三重県茶業史」。平安時代から平成に至る伊勢茶の歴史と茶業の変遷を、写真とともに章別に振り返る一冊です。",
    bookMieP2:
      "著者は元三重県農業技術センター茶業センター場長・高瀬孝二氏。序文、第一章〜第十章、付録、参考文献まで、原本の構成に沿ってウェブサイト上でお読みいただけます。",
    bookMieLinkText: "三重県茶業史を読む",
    altMieCover: "三重県茶業史 表紙",
    bookMieNoticeBefore:
      "三重県茶業会議所、および編者である高瀬孝二氏の許諾を得て掲載しております。掲載にあたり、著作権等の権利関係には最大限の配慮をしておりますが、一部に古い資料からの引用・転記が含まれております。万が一、掲載について不都合がある権利者様がいらっしゃいましたら、大変お手数ですが下記",
    bookMieNoticeLinkText: "お問合せ窓口",
    bookMieNoticeAfter:
      "までご連絡いただけますようお願い申し上げます。確認の上、速やかに修正・削除等の対応をいたします。",
    bookHistoryTitle: "伊勢茶の歴史 お茶のおもしろ知識",
    bookHistoryP1:
      "三重県の伝統ブランド「伊勢茶」は、鎌倉時代から続く深い歴史を持ち、江戸時代には将軍家への献上や海外輸出で日本の茶業を牽引しました。現在は全国第3位の生産量を誇り、その濃厚な風味と高い品質が特徴です。",
    bookHistoryP2:
      "本書は、緑茶の製法やカテキン等の健康成分、適切な温度での淹れ方など、お茶の基礎知識を幅広く解説しています。茶器の文化や「茶寿」などの習わし、保存法や茶殻の活用まで、日常でのお茶の楽しみ方を提案。先人が築いた伝統を背景に、一杯のお茶が暮らしに健やかさと彩りをもたらすことを伝える一冊です。",
    bookHistoryLinkText: "伊勢茶の歴史 お茶のおもしろ知識を読む",
    altHistoryCover: "伊勢茶の歴史 お茶のおもしろ知識 表紙",
    bookKawamataTitle: "伊勢茶発祥の地　川俣谷のお茶",
    bookKawamataP1:
      "三重県「伊勢茶」の発祥地とされる川俣谷を中心に、鎌倉時代から現代までの歩みを記した記録です。江戸時代、紀州藩の保護や伊勢商人の活躍により、伊勢茶は将軍家への献上や全国への広範な流通網を持つ一大ブランドへと成長しました。",
    bookKawamataP2:
      "明治以降は、大谷嘉兵衛らの尽力で横浜・神戸・四日市港から米国等へ盛んに輸出され、日本茶貿易の主力を担いました。戦後の衰退期も、深蒸し茶の普及や降霜防止技術などの革新により復興を遂げます。本書は、豊富な古文書や取引記録を基に、伝統を守りつつ世界へ挑んだ先人たちの情熱と産業史を浮き彫りにしています。",
    bookKawamataLinkText: "伊勢茶発祥の地　川俣谷のお茶を読む",
    authorBio:
      "【著者略歴】高瀬　孝二：松阪市在住（元三重県職員）。三重県農業技術センター主席研究員兼茶業センター場長を最後に定年退職。退職後は三重県茶業会議所常務理事に就任。日本茶インストラクター協会認定・日本茶インストラクターリーダー、日本茶アドバイザー養成講座専任講師。令和６年 瑞宝双光章を受章。主な著書に「三重県茶業史」がある。",
    sec2Title1: "全国第3位を誇る「お茶どころ」",
    sec2P1:
      "三重県は静岡県・鹿児島県に次いで全国第3位の生産量を誇る日本有数の茶産地です。意外と知られていない事実ですが、日本のお茶の多くがここ三重県で支えられています。",
    sec2Title2: "伊勢茶の特徴「深蒸し茶の味わい」",
    sec2P2:
      "三重県松阪市飯南町は、深蒸し茶の産地として全国にその名を知られる特別な土地です。藤八茶寮が扱うのは、この飯南町産のお茶のみ。深蒸しならではの製法がテアニンをはじめとする旨み成分をたっぷりと引き出し、濃くてまろやかな一杯を生み出します。全国の品評会で上位を独占してきたその実力が、産地へのこだわりを裏づけています。",
    sec2FeatureList: [
      "味わい：芯のある渋みと記憶に残る深いコク",
      "水色：細かい茶葉が溶け込むことで濁りのある深い緑色",
      "香り：若草のような芳醇な香り",
      "淹れ方：低めの温度（70℃前後）で淹れると甘みがより引き立つ",
    ],
    cardTitle: "深蒸し茶",
    cardBody:
      "普通の煎茶が約30〜40秒ほど蒸すのに対し、深蒸し茶はその2〜4倍（約60〜180秒）の時間をかけて蒸します。この長い蒸し工程によって茶葉の細胞がより壊れ、渋みが抑えられてまろやかで濃厚な味わいが生まれます。茶の水色（すいしょく）は細かい茶葉が溶け込むことで濁りのある深い緑色になるのが特徴です。また、煎茶よりも低めの温度（70℃前後）で淹れると甘みがより引き立ちます。",
    sec3Title: "伊勢茶の「味」が愛される理由：恵まれた風土と力強い茶葉",
    sec3P1:
      "三重県、とりわけ「南勢地域」は古くからお茶の栽培に最適な条件が奇跡的なバランスで整った場所です。この地域は年間を通じて温暖な気候に恵まれ燦々と降り注ぐ日照時間が非常に長いのが特徴です。また宮川をはじめとする清流がもたらす適度な雨量と湿潤な空気がお茶の木を健やかに育て上げます。こうした厳しいながらも豊かな自然環境に耐え、養分をたっぷりと蓄えた茶葉は他産地にはない肉厚で力強い葉へと成長します。",
    sec3P2:
      "茶葉の厚みはそのまま味わいの深さへと直結します。しっかりとした厚みのある伊勢茶の葉はお湯を注いだ瞬間に力強い渋みと濃厚なコクを余すことなく解き放ちます。ただ苦いだけではない、芯の通った「お茶本来の旨み」を感じられるのが伊勢茶の醍醐味です。",
    sec3P3:
      "日照条件と独自の気候は、茶葉の中に健康成分である「カテキン」や旨み成分の「アミノ酸（テアニン）」を豊富に生成させます。そのため淹れた瞬間に広がる水色（すいしょく）は驚くほど鮮やかな緑色。鼻をくすぐる若草のような芳醇な香りと、口の中に長く留まる豊かな余韻は、日常のひとときを特別なリラックスタイムへと変えてくれます。",
    sec4Title: "伊勢茶の歴史",
    sec4Heian:
      "伊勢茶の歴史は極めて古く、平安時代の延喜年間（901～922年）まで遡ります。当初はお茶は貴重な「薬」として寺院で大切に育てられていました。",
    sec4Edo:
      "江戸時代には、御師や伊勢商人の活躍により伊勢茶が日本中に広まりました。文禄3年（1594年）の検地帳に茶が年貢として納められている記録があり、当時すでに栽培が行われていたことがうかがえます。",
    sec4Meiji:
      "明治時代には、日本茶輸出の多くを伊勢茶が担いました。明治前期には三重県が全国一の茶生産額を誇り、とくにアメリカ向け輸出で中心的な役割を果たしました。明治17年（1884年）には、椋本の駒田作五郎らが三重県製茶会社を組織し、アメリカの商会へ伊勢茶を直接輸出。全国トップの業績をあげたと伝わります。",
    sec5Title: "伊勢茶の輸出と知られざる黄金時代",
    sec5P1:
      "伊勢茶には、かつてアメリカの日常に深く溶け込み主要な輸出品として日本経済を支えた「黄金時代」がありました。しかし昭和期に入り日米関係が急速に悪化すると、隆盛を極めた伊勢茶の輸出ルートは非情にも途絶えてしまいました。もしあの歴史的な動乱がなかったなら、今頃アメリカでは、コーヒーや紅茶と並んで、日本の「煎茶」が日常的に親しまれる文化が深く根付いていたはずだと言われています。伊勢茶はそれほどまでに世界の人々の心を捉え、文化として定着する直前まで辿り着いていたのです。",
    sec5P2:
      "江戸末期の開国と共に日本の豊かな農産物は世界へと羽ばたきました。幕末から明治初期にかけて、お茶は生糸と並ぶ日本の二大輸出品として外貨獲得の柱となり、その輸出先の多くはアメリカでした。驚くべきことに当時の日本茶輸出の80％以上がアメリカ向けであり、その巨大な需要を支える中心的な役割を担っていたのが「伊勢茶」だったのです。",
    sec5P3:
      "伊勢茶がどれほど現地で愛されていたかを物語るエピソードがあります。最盛期のニューヨークではなんと1,500軒以上のティーガーデンが軒を連ね、至るところで伊勢茶が提供されていました。アメリカの人々にとって伊勢茶の爽やかな香りと深い味わいは、洗練されたひとときを彩る日常の楽しみとなっていました。",
    cardHojichaTitle: "ほうじ茶",
    cardHojichaBody:
      "ほうじ茶（焙じ茶）は、煎茶・番茶・茎茶などの緑茶を強火で焙煎してつくるお茶です。焙煎によって生まれるピラジン類という香気成分がほうじ茶特有の香ばしさを作ります。刺激が少ないため食事中のお茶に向いているほか、焙煎によってカフェインが減るので夜でも飲みやすいとされます。英語では roasted green tea と呼ばれます。",
    cardWakochaTitle: "和紅茶",
    cardWakochaBody:
      "最近人気の日本で栽培された茶葉を日本国内で紅茶として加工したお茶です。海外紅茶（アッサム種など）は渋みが強いのに対し和紅茶は中国種の茶樹を使うことが多く、甘み・旨みが出やすいのが特徴。また華やかで強い香りの海外紅茶に比べ、和紅茶はほのかで繊細な香りが魅力です。英語では Japanese black tea と呼ばれます。",
    altKawamata: "伊勢茶発祥の地 川俣谷",
    altField: "深蒸し茶の茶畑",
};

/** トップページの商品一覧を指定フィルターで絞り込んだURL（filter=深蒸し茶 など） */
function productsFilterHref(filterValue: string): string {
  const q = `filter=${encodeURIComponent(filterValue)}`;
  return withTrailingSlashPath(`/?${q}`);
}

export default function IsechaPage() {
  const t = ISECHA_TEXTS;
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="isecha-heading" className="mb-12">
          <IsechaSubNav current="main" />

          <h1
            id="isecha-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.intro}
              </p>
              <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
                {t.sec2Title1}
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P1}
              </p>
              <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
                {t.sec2Title2}
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P2}
              </p>
              <ul className="mb-4 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2FeatureList.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <figure className="overflow-hidden rounded-xl">
              <Image
                src="/images/isecha-field.jpg"
                alt={t.altField}
                width={1024}
                height={768}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="mt-4 flex justify-center md:col-span-2">
              <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
                <div>
                  <h3 className="mb-2 text-[0.98rem] font-semibold text-tea-deep">
                    {t.cardTitle}
                  </h3>
                  <p className="mb-0">{t.cardBody}</p>
                  <div className="flex justify-center md:justify-end mt-3">
                    <Link
                      href={productsFilterHref("深蒸し茶")}
                      className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span className="text-base font-bold">{t.cardTitle}</span>
                      <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                        {COMMON_TEXTS.product.viewDetails}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
              {t.sec3Title}
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec3P1}
            </p>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec3P2}
            </p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec3P3}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
              <h3 className="mb-2 text-[0.98rem] font-semibold text-tea-deep">
                {t.cardHojichaTitle}
              </h3>
              <p className="mb-0">{t.cardHojichaBody}</p>
              <div className="flex justify-center md:justify-end mt-3">
                <Link
                  href={productsFilterHref("ほうじ茶")}
                  className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span className="text-base font-bold">{t.cardHojichaTitle}</span>
                  <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                    {COMMON_TEXTS.product.viewDetails}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
              {t.sec4Title}
            </h2>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec4Heian}
            </p>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec4Edo}
            </p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec4Meiji}
            </p>
          </div>

          <div className="mt-10 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
              {t.sec5Title}
            </h2>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec5P1}
            </p>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec5P2}
            </p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec5P3}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
              <h3 className="mb-2 text-[0.98rem] font-semibold text-tea-deep">
                {t.cardWakochaTitle}
              </h3>
              <p className="mb-0">{t.cardWakochaBody}</p>
              <div className="flex justify-center md:justify-end mt-3">
                <Link
                  href={productsFilterHref("和紅茶")}
                  className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span className="text-base font-bold">{t.cardWakochaTitle}</span>
                  <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                    {COMMON_TEXTS.product.viewDetails}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
