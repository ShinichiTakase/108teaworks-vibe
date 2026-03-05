import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "おいしいお茶の淹れ方｜伊勢茶の藤八茶寮",
  description:
    "ティーバッグ・茶葉・パウダーのおいしい淹れ方と、水出しやラテのレシピ、お茶の保存方法をご紹介します。",
};

export default function HowToBrewPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="howto-heading" className="mb-12">
          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src="/images/how-to-brew/top.jpg"
                alt="お茶の時間のイメージ"
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 md:order-2">
              <h1
                id="howto-heading"
                className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep"
              >
                お茶の淹れ方
              </h1>
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                お家で楽しむお茶は、ちょっとした工夫で格段においしくなります。ポイントは、茶葉の量やお湯の量、温度、抽出時間のバランス。
                これさえ押さえれば、同じ茶葉でも驚くほど風味が引き立ちます。
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                このページでは毎日のティータイムにすぐ使える簡単レシピとコツをご紹介します。忙しい朝でも、ほっとひと息つきたい午後でも、お家で手軽に香り豊かなお茶を楽しめます。
              </p>
            </div>
          </div>

          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
            味の濃淡を決める、茶葉とお湯のバランス
          </h2>
          <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            茶葉の量・お湯の量・待ち時間の3つを意識すると、お好みの味に近づけやすくなります。
          </p>
          <ul className="mb-6 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            <li>
              <span className="font-semibold">茶葉の量</span>
              ：多くすれば味は濃く、少なければ淡くなります。
            </li>
            <li>
              <span className="font-semibold">お湯の量</span>
              ：お湯が少なければ成分が濃く、多ければ穏やかな味わいに。上質な茶葉ほど、少量で深い味を楽しめます。
            </li>
            <li>
              <span className="font-semibold">待ち時間</span>
              ：お湯の温度が低いほど長めに、高いほど短めに。渋味が苦手な方は、短めに切り上げるのがおすすめです。
            </li>
          </ul>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                ティーバッグのおいしい淹れ方
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                目安：湯量 160cc／湯温 70〜80℃
              </p>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>マグカップにティーバッグを入れる</li>
                <li>160ccほどお湯を注ぐ</li>
                <li>90〜120秒ほど待って完成</li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                緑茶は70〜80℃でゆっくりと淹れると甘みとコクがしっかり抽出されます。ほうじ茶は90℃くらいの高めの湯温にすると香ばしさがより際立ちます。
                同じティーバッグにお湯を足すことで、2煎目・3煎目も楽しめます。
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/how-to-brew/tea-bag.jpg"
                alt="ティーバッグで淹れるお茶"
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                茶葉（リーフ）のおいしい淹れ方
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                目安：湯量 160cc／湯温 70〜80℃
              </p>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>急須に茶葉を3g入れる</li>
                <li>160ccほどお湯を注ぐ</li>
                <li>蓋をして90〜120秒ほど待つ</li>
                <li>
                  注ぐ時はゆっくりと。複数の茶碗に注ぐ場合は少量ずつ順番に注ぐことで濃度が均一になり、みなさんで同じ味を楽しめます。
                </li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                深蒸し茶は茶葉が細かいため、網目の細かい急須（深蒸し急須）をお使いいただくと、より一層美味しくお楽しみいただけます。
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/how-to-brew/pot.jpg"
                alt="急須で淹れるお茶"
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          <div className="mb-10">
            <h3 className="mt-0 mb-2 text-[0.9375rem] font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
              深蒸し茶用急須の選び方
            </h3>
            <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              <li>
                <span className="font-semibold">サイズ</span>
                ：200〜300ml程度が一般的です（2〜3人分）。一人で飲むことが多い場合は、少し小さめの150〜200mlを選ぶと、お湯の量がコントロールしやすく美味しく淹れられます。
              </li>
              <li>
                <span className="font-semibold">形</span>
                ：平べったい形や底が広いものをおすすめします。細かい茶葉が底に薄く広がるため、お湯が均一に行き渡り、旨味がしっかり抽出されます。
              </li>
              <li>
                <span className="font-semibold">素材</span>
                ：常滑焼（とこなめやき）や万古焼（ばんこやき）は、酸化鉄を多く含んだ粘土で焼かれており、お茶のタンニンと反応して渋みをまろやかに、コクを深くしてくれます。深蒸し茶の濃厚な味わいと非常に相性が良いです。
              </li>
              <li>
                <span className="font-semibold">茶こし</span>
                ：深蒸し茶は茶葉が粉っぽいため、通常の急須では目詰まりしやすいです。ステンレスメッシュの帯網や、深蒸し専用に作られた目の細かいものを選びます。
              </li>
            </ul>
          </div>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src="/images/how-to-brew/water.jpg"
                alt="水出し茶のイメージ"
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 md:order-2">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                水出し茶の作り方
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                目安：お水1リットルにつき、茶葉10〜15g（大さじ2〜3杯）またはティーバッグ2〜3個
              </p>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>ポットやボトルに茶葉（またはティーバッグ）を入れる</li>
                <li>1リットルのお水を注ぐ</li>
                <li>冷蔵庫で2〜6時間おく</li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                深蒸し茶は鮮やかな緑色とコクのある味わいに、ほうじ茶は香ばしく軽やかな仕上がりになります。作った水出し茶は衛生上、1日で飲み切ってください。
              </p>
            </div>
          </div>

          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            藤八茶寮のパウダー緑茶が選ばれる理由
          </h3>
          <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
            一般的なパウダー緑茶とは一線を画す、上質な伊勢茶の「深蒸し茶」を贅沢に原料として使用しています。本来、粉末茶はラテにすると色が沈みがちですが、藤八茶寮のパウダーなら、抹茶に引けを取らない深みのある香りと、目にも鮮やかな緑色のラテをお楽しみいただけます。深蒸し茶ならではの濃厚なコクと鮮やかな緑色を、粉末状でも損なうことなく閉じ込めました。
          </p>

          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            緑茶ラテ・ほうじ茶ラテ
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="flex flex-col justify-between text-[0.9375rem] leading-relaxed text-ink-muted">
              <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                緑茶ラテ
              </h3>
              <ul className="mb-2 list-disc pl-5">
                <li>緑茶パウダー：3g</li>
                <li>お湯：25〜30ml</li>
                <li>牛乳：160cc</li>
                <li>砂糖：小さじ1（お好みで）</li>
              </ul>
              <p className="mb-0">
                粉末緑茶を少量のお湯でよく溶かし、温めた牛乳を注いで完成です。
              </p>
            </div>
            <div className="flex items-stretch">
              <figure className="w-full overflow-hidden rounded-md">
                <Image
                  src="/images/how-to-brew/green-tea-latte.jpg"
                  alt="緑茶ラテ"
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover md:h-44"
                />
              </figure>
            </div>
            <div className="flex flex-col justify-between text-[0.9375rem] leading-relaxed text-ink-muted">
              <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                ほうじ茶ラテ
              </h3>
              <ul className="mb-2 list-disc pl-5">
                <li>ほうじ茶パウダー：3g</li>
                <li>お湯：25〜30ml</li>
                <li>牛乳：160cc</li>
                <li>砂糖：小さじ1（お好みで）</li>
              </ul>
              <p className="mb-0">
                粉末ほうじ茶を少量のお湯でよく溶かし、温めた牛乳を注いでお楽しみください。
              </p>
            </div>
            <div className="flex items-stretch">
              <figure className="w-full overflow-hidden rounded-md">
                <Image
                  src="/images/how-to-brew/roasted-tea-latte.jpg"
                  alt="ほうじ茶ラテ"
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover md:h-44"
                />
              </figure>
            </div>
          </div>
          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            パウダー緑茶（粉末緑茶）と抹茶の違い
          </h2>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            パウダー緑茶（粉末緑茶）とは
          </h3>
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            普段私たちが急須で楽しむ「煎茶」をそのまま粉砕したものです。一般的な粉末茶は、抹茶特有の香気がなく、ラテにした際に色がくすみやすい傾向がありますが、日常使いしやすく、茶葉の栄養成分を丸ごと摂取できるのが利点です。太陽の光をたっぷりと浴びて育つため、健康成分であるカテキンが豊富に含まれています。
          </p>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            抹茶とは
          </h3>
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            抹茶の原料は「碾茶（てんちゃ）」です。収穫前の約20日間、茶園を黒いネット等で覆う「覆下（おおした）栽培」を行うことで日光を遮り、旨味成分（テアニン）が渋み成分（カテキン）に変化するのを抑えます。その結果、抹茶特有の鮮やかな緑色と、深みのあるコクが生まれます。
          </p>
          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            お茶の保存方法
          </h2>
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            お茶は乾物ですが、「鮮度」が大切な農産物です。開封後・未開封それぞれで、適切な保存を心がけることで、香りと風味を長く保てます。
          </p>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            開封後の保存
          </h3>
          <ul className="mb-3 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            <li>移り香の強い食材（コーヒーやスパイスなど）の近くは避ける</li>
            <li>密閉性の高い袋や茶缶に入れ、空気に触れさせない</li>
            <li>直射日光の当たらない冷暗所に保管する</li>
          </ul>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            未開封での長期保存
          </h3>
          <ul className="mb-4 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            <li>冷蔵・冷凍保存で鮮度をキープ</li>
            <li>
              開封前は必ず常温に戻してから封を開け、結露による劣化を防ぐ
            </li>
          </ul>

          <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            開封後は2週間〜1ヶ月を目安に飲み切っていただくのがおすすめです。ぜひ、そのときどきの気分に合わせて、いちばんおいしい一杯をお楽しみください。
          </p>
        </section>
      </div>
    </main>
  );
}

