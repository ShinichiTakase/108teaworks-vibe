import type { Locale } from "./i18n";

export const PROMO_VIDEO_TEXTS: Record<
  Locale,
  {
    sectionAria: string;
    playAria: string;
    thumbAlt: string;
    prefix: string;
    cafeName: string;
    cafeNameShort: string;
    ownerIntro: string;
    mid: string;
    afterProduct: string;
    end: string;
    productLink: string;
    productName: string;
    watchCta: string;
    dialogAria: string;
    closeAria: string;
  }
> = {
  ja: {
    sectionAria: "ほうじ茶ラテ動画",
    playAria: "ほうじ茶ラテの動画を再生",
    thumbAlt: "ほうじ茶ラテの動画",
    prefix: "外苑前 ",
    cafeName: "カフェ 柔和 (にゅうわ)",
    cafeNameShort: "カフェ 柔和",
    ownerIntro: "のオーナーでインフルエンサーの",
    mid: "さんが、藤八茶寮の",
    afterProduct: "を使って、とっても楽しいほうじ茶ラテを作ってくれました。ぜひご覧ください。もちろん、",
    end: "でもお楽しみいただけます。",
    productLink: "/products/houjicha-powder-80g",
    productName: "ほうじ茶パウダー",
    watchCta: "動画を見る",
    dialogAria: "ほうじ茶ラテ動画",
    closeAria: "閉じる",
  },
  en: {
    sectionAria: "Hojicha latte video",
    playAria: "Play hojicha latte video",
    thumbAlt: "Hojicha latte video",
    prefix: "Gaienmae ",
    cafeName: "Cafe Nyuwa",
    cafeNameShort: "Cafe Nyuwa",
    ownerIntro: " owner and influencer ",
    mid: " made a fun hojicha latte with Fujihachiya's ",
    afterProduct: ". Please take a look. You can also enjoy it at ",
    end: ".",
    productLink: "/en/products/houjicha-powder-80g",
    productName: "hojicha powder",
    watchCta: "Watch video",
    dialogAria: "Hojicha latte video",
    closeAria: "Close",
  },
  ko: {
    sectionAria: "호지차 라떼 영상",
    playAria: "호지차 라떼 영상 재생",
    thumbAlt: "호지차 라떼 영상",
    prefix: "가엔마에 ",
    cafeName: "카페 뉴와 (にゅうわ)",
    cafeNameShort: "카페 뉴와",
    ownerIntro: " 오너이자 인플루언서 ",
    mid: "님이 후지하치야의 ",
    afterProduct: "로 아주 재미있는 호지차 라떼를 만들어 주셨습니다. 꼭 보세요. 물론 ",
    end: "에서도 즐기실 수 있습니다.",
    productLink: "/ko/products/houjicha-powder-80g",
    productName: "호지차 파우더",
    watchCta: "영상 보기",
    dialogAria: "호지차 라떼 영상",
    closeAria: "닫기",
  },
  zh: {
    sectionAria: "焙茶拿铁视频",
    playAria: "播放焙茶拿铁视频",
    thumbAlt: "焙茶拿铁视频",
    prefix: "外苑前 ",
    cafeName: "咖啡馆 柔和 (にゅうわ)",
    cafeNameShort: "咖啡馆 柔和",
    ownerIntro: "的店主兼网红",
    mid: "用藤八茶寮的",
    afterProduct: "制作了非常有趣的焙茶拿铁，欢迎观看。当然您也可以在",
    end: "品尝。",
    productLink: "/zh/products/houjicha-powder-80g",
    productName: "焙茶粉",
    watchCta: "观看视频",
    dialogAria: "焙茶拿铁视频",
    closeAria: "关闭",
  },
};
