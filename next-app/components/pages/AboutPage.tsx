import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";

const ABOUT_TEXTS: Record<
  Locale,
  {
    h1: string;
    lead1: string;
    lead2: string;
    sec2Title: string;
    sec2P1: string;
    sec2P2: string;
    sec3Title: string;
    sec3P1: string;
    sec4Title: string;
    sec4P1: string;
    sec4P2: string;
    sec4P3: string;
    sec4P4: string;
    altImage1: string;
    altImage2: string;
    altImage3: string;
    altImage4: string;
  }
> = {
  ja: {
    h1: "藤八茶寮について",
    lead1:
      "藤八茶寮では、三重県内で採れた茶葉のみを使用したシングルオリジンの伊勢茶を取り扱っています。こっくりとした甘みが広がる深蒸し緑茶、鼻に抜ける香ばしさが心地よいほうじ茶。思わずおうちに置いておきたくなるような日々のお茶を揃えました。私たちが目指すのは、コーヒーや紅茶のようにお気に入りのカップやおやつを用意してすてきな時間のお供にしたくなるお茶です。",
    lead2:
      "ご自宅でお楽しみいただけるのはもちろん、コーヒースタンドをはじめとした飲食店様への卸業務も行っています。",
    sec2Title: "屋号に込めた想い：なぜ「藤八」なのか",
    sec2P1:
      "「藤八茶寮」という名は、私の先祖である高瀬藤八（たかせ とうはち）の歩んだ軌跡を受け継ぐために名付けられました。明治の海を越えた、ハイカラな茶商人",
    sec2P2:
      "時は明治。三重県松阪市の自社茶園で丹精込めて育てた伊勢茶を携え、藤八は神戸の港へと向かいました。当時の神戸は開国に沸く異国情緒あふれる街。藤八はスミス・ベーカー商会をはじめとするアメリカ商館を相手に、堂々と渡り合っていました。一年の半分を神戸で過ごし、シルクハットを小粋にかぶりこなしては、アメリカ西海岸へと続く巨大な輸出航路を切り拓いていく――。その姿は、当時としては驚くほど先駆的で、情熱に満ちた「ハイカラな商人」そのものでした。",
    sec3Title: "令和に呼び覚ます、藤八の志",
    sec3P1:
      "かつて藤八が見つめていた、伊勢茶が世界を席巻するあの輝かしい光景をもう一度令和の時代によみがえらせたい。単にお茶を売るだけでなく、時代を先取りする感性と、海を越えて良質なものを届けようとした彼の真摯な仕事ぶりを、私たちは現代の形で形にしていきたいと考えています。「藤八茶寮」という名には、100年以上の時を超えて再び伊勢茶の魅力を世界へと繋いでいく、私たちの揺るぎない決意が込められています。",
    sec4Title: "すこし、私のこと",
    sec4P1:
      "東京・青山のコーヒースタンドで6年間働き、コロナ禍をきっかけに、自分の将来や働き方について立ち止まって考えるようになりました。",
    sec4P2:
      "そんなとき、友人の何気ない一言から思い出したのが子どもの頃おばあちゃんの家で飲んだあの一杯のお茶でした。「このお茶を、今の時代にもう一度みんなに飲んでもらえないだろうか」そう思い立ったことがすべての始まりです。",
    sec4P3:
      "上京してコーヒーを学び好きな仕事を通して積み重ねてきた経験を活かして、明治に藤八さんが築いた少しハイカラで粋なその仕事を令和の時代にもう一度よみがえらせてみようじゃないか。",
    sec4P4:
      "創業者の名である「藤八」を屋号に、明治から令和へ。勝手ながら、想いのバトンを受け取りました。三重から東京、そして世界へ。伊勢茶を世界中にお届けします。ぜひ一度、のんでみてください。",
    altImage1: "藤八茶寮の伊勢茶",
    altImage2: "高瀬",
    altImage3: "伊勢茶",
    altImage4: "春摘み",
  },
  en: {
    h1: "About Fujihachiya",
    lead1:
      "At Fujihachiya we offer single-origin Ise tea made only from leaves grown in Mie Prefecture. Rich, sweet fukamushi sencha and aromatic hojicha—teas you’ll want to keep at home every day. We aim to be a tea that, like coffee or black tea, makes you reach for a favourite cup and a snack and enjoy a moment of calm.",
    lead2:
      "You can enjoy our teas at home, and we also supply cafés and restaurants, including coffee stands.",
    sec2Title: "The story behind our name: why “Fujihachi”",
    sec2P1:
      "The name “Fujihachiya” was chosen to carry on the path of my ancestor, Takase Tohachi. A modern tea merchant who crossed the seas in the Meiji era.",
    sec2P2:
      "In the Meiji period, Tohachi set out for the port of Kobe with Ise tea grown with care on the family estate in Matsusaka, Mie. Kobe was then a city buzzing with the spirit of opening to the world. Tohachi traded confidently with American firms such as Smith, Baker & Co., spent half the year in Kobe, and in his silk hat opened a huge export route to the American West. For his time, he was a strikingly forward-looking, passionate merchant.",
    sec3Title: "Reviving Tohachi’s spirit in Reiwa",
    sec3P1:
      "We want to bring back the vision Tohachi once had: Ise tea captivating the world. Not just selling tea, but reviving in a modern form his sensibility and his commitment to delivering quality across the seas. The name Fujihachiya reflects our resolve to connect the appeal of Ise tea to the world again, across more than a hundred years.",
    sec4Title: "A little about me",
    sec4P1:
      "I worked at a coffee stand in Aoyama, Tokyo for six years. The pandemic made me pause and think about my future and how I wanted to work.",
    sec4P2:
      "A casual remark from a friend reminded me of the tea I drank at my grandmother’s house as a child. “What if we could share this tea with everyone again today?” That thought was the start of everything.",
    sec4P3:
      "I want to use what I learned from coffee and the work I love to bring back, in the Reiwa era, the stylish, pioneering spirit of Tohachi’s Meiji-era trade.",
    sec4P4:
      "With the founder’s name “Fujihachi” as our own, from Meiji to Reiwa we’ve taken up the baton. From Mie to Tokyo and the world—we deliver Ise tea. We hope you’ll try a cup.",
    altImage1: "Ise tea from Fujihachiya",
    altImage2: "Takase",
    altImage3: "Ise tea",
    altImage4: "First flush",
  },
  ko: {
    h1: "후지하치야 소개",
    lead1:
      "후지하치야는 미에현에서 난 찻잎만 사용한 싱글 오리진 이세차를 취급합니다. 진한 단맛의 후카무시 녹차, 고소한 향이 기분 좋은 호지차. 집에 두고 싶은 일상의 차를 준비했습니다. 우리가 목표로 하는 것은 커피나 홍차처럼 좋아하는 컵과 간식을 준비하고 좋은 시간을 갖고 싶게 만드는 차입니다.",
    lead2:
      "집에서 즐기실 수 있을 뿐 아니라, 커피 스탠드를 비롯한 음식점을 위한 도매도 하고 있습니다.",
    sec2Title: "상호에 담긴 마음: 왜 「후지하치」인가",
    sec2P1:
      "「후지하치야」라는 이름은 선조 다카세 도하치가 걸어온 발자취를 이어가기 위해 지었습니다. 메이지 시대, 바다를 넘은 하이카라 차 상인.",
    sec2P2:
      "메이지 시대. 미에현 마쓰사카의 자사茶园에서 정성껏 키운 이세차를 들고 도하치는 고베 항으로 향했습니다. 당시 고베는 개항으로 뜨거운 이국 정서의 거리였습니다. 도하치는 스미스·베이커 상회를 비롯한 미국 상관과 당당히 거래했습니다. 1년의 절반을 고베에서 보내며 실크햇을 멋지게 쓰고 미국 서부로 이어지는 거대한 수출 항로를 열었습니다. 그 모습은 당시로서는 놀라울 만큼 선구적이고 열정에 찬 「하이카라 상인」 그 자체였습니다.",
    sec3Title: "레이와에 되살리는, 도하치의 뜻",
    sec3P1:
      "한때 도하치가 바라보던, 이세차가 세계를 휩쓸던 그 빛나는 광경을 레이와 시대에 다시 살리고 싶습니다. 단지 차를 파는 것이 아니라, 시대를 앞서가는 감성과 바다를 넘어 좋은 것을 전하려 했던 그의 진지한 일솜씨를 우리는 현대적인 형태로 만들어가고자 합니다. 「후지하치야」라는 이름에는 100년 이상의 시간을 넘어 다시 이세차의 매력을 세계로 잇겠다는 우리의 흔들림 없는 결의가 담겨 있습니다.",
    sec4Title: "조금, 저에 대해",
    sec4P1:
      "도쿄 아오야마의 커피 스탠드에서 6년간 일했고, 코로나를 계기로 자신의 미래와 일하는 방식에 대해 멈추고 생각하게 되었습니다.",
    sec4P2:
      "그때 친구의 무심한 한마디로 떠올린 것이 어린 시절 할머니 댁에서 마신 그 한 잔의 차였습니다. 「이 차를 지금 시대에 다시 모두에게 마시게 할 수 있을까」 그 생각이 모든 시작이었습니다.",
    sec4P3:
      "상경해 커피를 배우고 좋아하는 일을 통해 쌓아온 경험을 살려, 메이지에 도하치가 세운 조금 하이카라하고 멋진 그 일을 레이와 시대에 다시 살려보자.",
    sec4P4:
      "창업자의 이름 「도하치」를 상호로, 메이지에서 레이와로. 스스로만의 생각으로, 마음의 배턴을 받았습니다. 미에에서 도쿄, 그리고 세계로. 이세차를 전 세계에 보내드립니다. 한 번 드셔 보세요.",
    altImage1: "후지하치야의 이세차",
    altImage2: "다카세",
    altImage3: "이세차",
    altImage4: "봄 수확",
  },
  zh: {
    h1: "关于藤八茶寮",
    lead1:
      "藤八茶寮只使用三重县产的茶叶，经营单一产地伊势茶。醇厚甘甜深蒸绿茶、香气怡人焙茶，我们备齐了让人想常备家中的日常茶品。我们追求的是像咖啡与红茶那样，让人想准备好心爱的杯子和茶点、享受美好时光的茶。",
    lead2:
      "除在家享用外，我们也面向咖啡站等餐饮店开展批发业务。",
    sec2Title: "屋号中寄托的心意：为何取名「藤八」",
    sec2P1:
      "「藤八茶寮」之名，是为继承先祖高瀬藤八走过的轨迹而取。跨越明治之海、走在时代前列的茶商。",
    sec2P2:
      "时值明治。藤八带着在三重县松阪市自家茶园精心培育的伊势茶前往神户港。当时的神户是开国热潮下的异国风情之街。藤八与史密斯-贝克商会等美国商馆从容往来，一年中有半年在神户度过，头戴丝礼帽，开拓通往美国西海岸的巨大出口航线。其姿态在当时堪称先驱，是充满热情的「摩登商人」本人。",
    sec3Title: "在令和唤醒藤八之志",
    sec3P1:
      "我们想再次唤醒藤八曾凝视的、伊势茶风靡世界的那幅景象。不仅是卖茶，我们愿以现代形式重现他那领先时代的感性以及跨海传递优质茶品的诚挚态度。「藤八茶寮」之名，寄托着我们跨越百余年再次将伊势茶魅力传向世界的坚定决心。",
    sec4Title: "略谈我自己",
    sec4P1:
      "我在东京青山的一家咖啡站工作了六年。疫情让我停下脚步，思考自己的未来与工作方式。",
    sec4P2:
      "朋友无意间的一句话，让我想起小时候在奶奶家喝过的那杯茶。「能不能让更多人再次喝到这样的茶？」这个念头成了一切的起点。",
    sec4P3:
      "我想用上京学咖啡、做喜爱工作所积累的经验，在令和时代再次唤醒藤八在明治时代开创的那份摩登与雅致。",
    sec4P4:
      "以创业者之名「藤八」为屋号，从明治到令和。我们接过了这份心意。从三重到东京，再到世界。我们将伊势茶送往全球。敬请品尝。",
    altImage1: "藤八茶寮的伊势茶",
    altImage2: "高瀬",
    altImage3: "伊势茶",
    altImage4: "春摘",
  },
};

type Props = {
  locale: Locale;
};

export default function AboutPage({ locale }: Props) {
  const t = ABOUT_TEXTS[locale];
  const IMG_BASE = "/images/about";

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="about-heading" className="mb-12">
          <h1
            id="about-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <div className="mb-12 grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src={`${IMG_BASE}/2025/12/about01-1.png`}
                alt={t.altImage1}
                width={800}
                height={600}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 text-right md:order-2">
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.lead1}
              </p>
              <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.lead2}
              </p>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.sec2Title}
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P1}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P2}
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src={`${IMG_BASE}/2026/01/takase-1.png`}
                alt={t.altImage2}
                width={500}
                height={578}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src={`${IMG_BASE}/2026/01/108-892x1024-1.jpg`}
                alt={t.altImage3}
                width={892}
                height={1024}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 text-right md:order-2">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.sec3Title}
              </h2>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec3P1}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.sec4Title}
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P1}
              </p>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P2}
              </p>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P3}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P4}
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src={`${IMG_BASE}/2025/12/haru-768x950-1.jpg`}
                alt={t.altImage4}
                width={768}
                height={950}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>
        </section>
      </div>
    </main>
  );
}
