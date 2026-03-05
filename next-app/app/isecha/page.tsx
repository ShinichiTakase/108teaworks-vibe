import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "伊勢茶とは｜伊勢茶の藤八茶寮",
  description:
    "伊勢茶の特徴や歴史、深蒸し茶・ほうじ茶・和紅茶について、三重県の風土とともにご紹介します。",
};

export default function IsechaPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="isecha-heading" className="mb-12">
          {/* 1. 伊勢茶発祥の地 川俣谷のお茶（左：画像／右：テキスト） */}
          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="overflow-hidden rounded-md">
              <a href="/kabatadani_no_ocha/">
                    <Image
                      src="/images/isecha-kawamata.jpg"
                  alt="伊勢茶発祥の地 川俣谷"
                  width={716}
                  height={1024}
                  className="h-auto w-full object-cover"
                />
              </a>
            </figure>
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-lg font-semibold text-tea-deep md:text-xl">
                <a
                  href="/kabatadani_no_ocha/"
                  className="no-underline hover:underline underline-offset-4"
                >
                  伊勢茶発祥の地 川俣谷のお茶
                </a>
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                店主・高瀬晴香のの大叔父であり日本茶インストラクターリーダーである高瀬孝二の著書「
                <a
                  href="/kabatadani_no_ocha/"
                  className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                >
                  伊勢茶発祥の地 川俣谷のお茶
                </a>
                」がPDFで全文ご覧いただけるようになりました。
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                伊勢茶発祥の地・川俣谷を舞台に、将軍への献上や明治の対米輸出を主導した先駆者たちの情熱と歩みを、日本茶インストラクターリーダーである著者が専門的知見から紐解きます。
                幻の手もみ技法から戦後の復活劇まで、一千年にわたる良質な伊勢茶の歴史を凝縮した、お茶のプロならではの視点が光る読み物です。
                古の伊勢商人が世界を夢見た軌跡をたどり、深蒸し茶の香りに隠された驚きの物語をぜひご覧ください。
              </p>
              <p className="mt-4 mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                【著者略歴】高瀬 孝二：松阪市在住（元三重県職員）。三重県農業技術センター主席研究員兼茶業センター場長を最後に定年退職。退職後は三重県茶業会議所常務理事に就任。日本茶インストラクター協会認定・日本茶インストラクターリーダー、日本茶アドバイザー養成講座専任講師。令和６年
                瑞宝双光章を受章。主な著書に「三重県茶業史」がある。
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                <a
                  href="/kabatadani_no_ocha/"
                  className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                >
                  伊勢茶発祥の地 川俣谷のお茶を読む
                </a>
              </p>
            </div>
          </div>

          <h1
            id="isecha-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            伊勢茶とは
          </h1>

          {/* 2. 伊勢茶の概要・特徴など（左：テキスト／右：画像） */}
          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                伊勢茶は、三重県内で生産されるお茶の総称として親しまれているブランド名です。その歴史は古く、江戸時代には既に「伊勢国（現在の三重県）」の特産品として広く栽培されていました。現在では三重県全域が産地となっており、地域の豊かな風土がその深い味わいを育んでいます。
              </p>

              <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
                全国第3位を誇る「お茶どころ」
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                三重県は静岡県・鹿児島県に次いで全国第3位の生産量を誇る日本有数の茶産地です。意外と知られていない事実ですが、日本のお茶の多くがここ三重県で支えられています。
              </p>

              <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
                伊勢茶の特徴「深蒸し茶の味わい」
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                伊勢茶を代表する深蒸し茶は、茶の葉を深く蒸して茶葉の葉柄や軸などに多く含有するテアニンなど旨みの成分の浸出を容易にする製法で、旨みが濃くまろやかな味のお茶として全国の品評会で常に上位を独占しています。
              </p>
            </div>

            <figure className="overflow-hidden rounded-xl">
              <Image
                src="/images/isecha-field.jpg"
                alt="深蒸し茶の茶畑"
                width={1024}
                height={768}
                className="h-auto w-full object-cover"
              />
            </figure>
            {/* 深蒸し茶のカード（ほうじ茶・和紅茶と同じ幅・インデント） */}
            <div className="mt-4 flex justify-center md:col-span-2">
              <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
                <div>
                  <h3 className="mb-2 text-[0.98rem] font-semibold text-tea-deep">
                    深蒸し茶
                  </h3>
                  <p className="mb-0">
                    普通の煎茶が約30〜40秒ほど蒸すのに対し、深蒸し茶はその2〜4倍（約60〜180秒）の時間をかけて蒸します。この長い蒸し工程によって茶葉の細胞がより壊れ、渋みが抑えられ、まろやかで濃厚な味わいが生まれます。茶の水色（すいしょく）は、細かい茶葉が溶け込むことで濁りのある深い緑色になるのが特徴です。また、煎茶よりも低めの温度（70℃前後）で淹れると、甘みがより引き立ちます。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 伊勢茶の風土と歴史 */}
          <div className="mt-10 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
              伊勢茶の「味」が愛される理由：恵まれた風土と力強い茶葉
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              三重県、とりわけ「南勢地域」は古くからお茶の栽培に最適な条件が奇跡的なバランスで整った場所です。この地域は、年間を通じて温暖な気候に恵まれ燦々と降り注ぐ日照時間が非常に長いのが特徴です。また宮川をはじめとする清流がもたらす適度な雨量と湿潤な空気がお茶の木を健やかに育て上げます。こうした厳しいながらも豊かな自然環境に耐え、養分をたっぷりと蓄えた茶葉は他産地にはない肉厚で力強い葉へと成長します。
            </p>

            <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
              芯のある渋みと、記憶に残る深いコク
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              茶葉の厚みはそのまま味わいの深さへと直結します。しっかりとした厚みのある伊勢茶の葉はお湯を注いだ瞬間に力強い渋みと濃厚なコクを余すことなく解き放ちます。ただ苦いだけではない、芯の通った「お茶本来の旨み」を感じられるのが伊勢茶の醍醐味です。
            </p>

            <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
              鮮やかな緑と、心安らぐ豊かな香り
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              日照条件と独自の気候は、茶葉の中に健康成分である「カテキン」や旨み成分の「アミノ酸（テアニン）」を豊富に生成させます。そのため淹れた瞬間に広がる水色（すいしょく）は驚くほど鮮やかな緑色。鼻をくすぐる若草のような芳醇な香りと、口の中に長く留まる豊かな余韻は、日常のひとときを特別なリラックスタイムへと変えてくれます。
            </p>

            <div className="mt-4 flex justify-center">
              <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
                <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                  ほうじ茶
                </h2>
                <p className="m-0">
                  ほうじ茶（焙じ茶）は、煎茶・番茶・茎茶などの緑茶を強火で焙煎してつくるお茶です。焙煎によって生まれるピラジン類という香気成分がほうじ茶特有の香ばしさを作ります。刺激が少ないため食事中のお茶に向いているほか、焙煎によってカフェインが減るので夜でも飲みやすいとされます。英語では roasted green tea と呼ばれます。
                </p>
              </div>
            </div>

            <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
              伊勢茶の歴史：千年の時を超えて受け継がれる「祈りと技」の物語
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              伊勢茶の歴史は驚くほど古くその起源は平安時代の延喜年間（901年〜922年）まで遡ります。今からおよそ1100年以上も前、既にこの地でお茶の栽培が始まっていたという記録が残されています。当時、お茶は現代のような日常の飲み物ではなく、極めて貴重な「薬」として扱われていました。主に寺院の境内で大切に育てられ、修行に励む僧侶たちの心身を整えるための養生品として、あるいは祈りと共に捧げられる特別な存在として用いられていたと考えられています。
            </p>

            <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
              伊勢商人の情熱と全国への広まり
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              その後、時代が江戸へと進むとお茶は文化として花開きます。ここで大きな役割を果たしたのが、日本全国を股にかけて活躍した「伊勢商人」たちでした。彼らの卓越した商才によって、三重の地で育まれた質の高いお茶は日本各地へと運ばれ、その名は一気に全国区へと広がっていきました。
            </p>

            <div className="mt-6 mb-8 grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                    伊勢茶の輸出と知られざる黄金時代：海を渡った日本茶の記憶
                  </h2>
                  <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                    伊勢茶には、かつてアメリカの日常に深く溶け込み主要な輸出品として日本経済を支えた「黄金時代」がありました。しかし昭和期に入り日米関係が急速に悪化すると、隆盛を極めた伊勢茶の輸出ルートは非情にも途絶えてしまいました。もしあの歴史的な動乱がなかったなら、今頃アメリカでは、コーヒーや紅茶と並んで、日本の「煎茶」が日常的に親しまれる文化が深く根付いていたはずだと言われています。伊勢茶はそれほどまでに世界の人々の心を捉え、文化として定着する直前まで辿り着いていたのです。
                  </p>
                </div>
                <div>
                  <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                    世界を席巻した伊勢茶：生糸に次ぐ国家の要
                  </h2>
                  <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                    江戸末期の開国と共に日本の豊かな農産物は世界へと羽ばたきました。幕末から明治初期にかけて、お茶は生糸と並ぶ日本の二大輸出品として外貨獲得の柱となり、その輸出先の多くはアメリカでした。驚くべきことに当時の日本茶輸出の80％以上がアメリカ向けであり、その巨大な需要を支える中心的な役割を担っていたのが「伊勢茶」だったのです。
                  </p>
                </div>
              </div>
              <figure className="mt-2 mb-4 overflow-hidden rounded-md md:mt-0">
                <Image
                  src="/images/isecha-label.jpg"
                  alt="輸出用ラベルに描かれた伊勢茶"
                  width={640}
                  height={480}
                  className="h-auto w-full max-w-[420px] object-cover mx-auto"
                />
              </figure>
            </div>

            <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
              ニューヨークに咲いたティーガーデンの文化
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              伊勢茶がどれほど現地で愛されていたかを物語るエピソードがあります。最盛期のニューヨークではなんと2500軒以上ものティーガーデンが軒を連ね、至るところで伊勢茶が提供されていました。アメリカの人々にとって伊勢茶の爽やかな香りと深い味わいは、洗練されたひとときを彩る日常の楽しみとなっていました。
            </p>

            <div className="mt-4 flex justify-center">
              <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
                <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                  和紅茶
                </h2>
                <p className="m-0">
                  最近人気の日本で栽培された茶葉を日本国内で紅茶として加工したお茶です。海外紅茶（アッサム種など）は渋みが強いのに対し和紅茶は中国種の茶樹を使うことが多く、甘み・旨みが出やすいのが特徴。また華やかで強い香りの海外紅茶に比べ、和紅茶はほのかで繊細な香りが魅力です。英語ではJapanese Blacktea と呼ばれます。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

