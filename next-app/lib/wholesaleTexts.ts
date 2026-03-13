import type { Locale } from "./i18n";

export const WHOLESALE_FORM_TEXTS: Record<
  Locale,
  {
    formHeading: string;
    formIntro: string;
    company: string;
    department: string;
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
    message: string;
    required: string;
    errCompany: string;
    errLastName: string;
    errFirstName: string;
    errPhone: string;
    errEmail: string;
    errEmailInvalid: string;
    errMessage: string;
    emailNote: string;
    confirmButton: string;
    confirm: string;
    confirmIntro: string;
    back: string;
    submit: string;
    sending: string;
    sendError: string;
    doneTitle: string;
    doneThanks: string;
    doneNote: string;
  }
> = {
  ja: {
    formHeading: "お問い合わせフォーム",
    formIntro: "パートナー募集に関するご相談は、下記フォームよりお送りください。",
    company: "事業者名",
    department: "部署名",
    lastName: "名前（姓）",
    firstName: "名前（名）",
    phone: "電話番号",
    email: "メールアドレス",
    message: "お問い合わせ内容",
    required: "（必須）",
    errCompany: "事業者名を入力してください。",
    errLastName: "姓を入力してください。",
    errFirstName: "名を入力してください。",
    errPhone: "電話番号を入力してください。",
    errEmail: "メールアドレスを入力してください。",
    errEmailInvalid: "メールアドレスの形式が正しくありません。",
    errMessage: "お問い合わせ内容を入力してください。",
    emailNote: "",
    confirmButton: "確認する",
    confirm: "入力内容の確認",
    confirmIntro: "入力内容をご確認ください。修正する場合は「戻る」を、送信する場合は「送信する」を押してください。",
    back: "戻る",
    submit: "送信する",
    sending: "送信中...",
    sendError: "送信中にエラーが発生しました。お手数ですが、時間をおいて再度お試しください。",
    doneTitle: "送信完了",
    doneThanks: "パートナー募集フォームよりお問い合わせいただき、ありがとうございます。",
    doneNote:
      "内容を確認のうえ、通常2〜3営業日以内にご返信させていただきます。しばらく経っても返信が届かない場合は、迷惑メールフォルダをご確認いただくか、別のメールアドレスにて再度お問い合わせください。",
  },
  en: {
    formHeading: "Contact form",
    formIntro: "For wholesale or partner enquiries, please use the form below.",
    company: "Company name",
    department: "Department",
    lastName: "Last name",
    firstName: "First name",
    phone: "Phone number",
    email: "Email address",
    message: "Your message",
    required: "(required)",
    errCompany: "Please enter your company name.",
    errLastName: "Please enter your last name.",
    errFirstName: "Please enter your first name.",
    errPhone: "Please enter your phone number.",
    errEmail: "Please enter your email address.",
    errEmailInvalid: "Please enter a valid email address.",
    errMessage: "Please enter your message.",
    emailNote: "",
    confirmButton: "Confirm",
    confirm: "Confirm your details",
    confirmIntro: "Please check the details below. Click \"Back\" to edit or \"Submit\" to send.",
    back: "Back",
    submit: "Submit",
    sending: "Sending...",
    sendError: "Something went wrong. Please try again later.",
    doneTitle: "Message sent",
    doneThanks: "Thank you for your enquiry via the partner form.",
    doneNote:
      "We will reply within 2–3 business days. If you don't hear from us, please check your spam folder or try another email address.",
  },
  ko: {
    formHeading: "문의 양식",
    formIntro: "파트너 모집 관련 문의는 아래 양식으로 보내 주세요.",
    company: "사업자명",
    department: "부서명",
    lastName: "이름(성)",
    firstName: "이름(이름)",
    phone: "전화번호",
    email: "이메일 주소",
    message: "문의 내용",
    required: "（필수）",
    errCompany: "사업자명을 입력해 주세요.",
    errLastName: "성을 입력해 주세요.",
    errFirstName: "이름을 입력해 주세요.",
    errPhone: "전화번호를 입력해 주세요.",
    errEmail: "이메일 주소를 입력해 주세요.",
    errEmailInvalid: "이메일 형식이 올바르지 않습니다.",
    errMessage: "문의 내용을 입력해 주세요.",
    emailNote: "",
    confirmButton: "확인",
    confirm: "입력 내용 확인",
    confirmIntro: "입력 내용을 확인해 주세요. 수정하려면 「돌아가기」를, 전송하려면 「전송」을 누르세요.",
    back: "돌아가기",
    submit: "전송",
    sending: "전송 중...",
    sendError: "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    doneTitle: "전송 완료",
    doneThanks: "파트너 모집 양식으로 문의해 주셔서 감사합니다.",
    doneNote:
      "내용 확인 후 보통 2~3 영업일 이내에 답변드리겠습니다. 답변이 오지 않으면 스팸 폴더를 확인하시거나 다른 이메일로 다시 문의해 주세요.",
  },
  zh: {
    formHeading: "咨询表单",
    formIntro: "合作伙伴相关咨询请通过下方表单提交。",
    company: "公司/商户名称",
    department: "部门",
    lastName: "姓",
    firstName: "名",
    phone: "电话号码",
    email: "电子邮箱",
    message: "咨询内容",
    required: "（必填）",
    errCompany: "请输入公司/商户名称。",
    errLastName: "请输入姓。",
    errFirstName: "请输入名。",
    errPhone: "请输入电话号码。",
    errEmail: "请输入电子邮箱。",
    errEmailInvalid: "请输入有效的电子邮箱地址。",
    errMessage: "请输入咨询内容。",
    emailNote: "",
    confirmButton: "确认",
    confirm: "确认内容",
    confirmIntro: "请确认以下内容。修改请点「返回」，提交请点「提交」。",
    back: "返回",
    submit: "提交",
    sending: "提交中...",
    sendError: "提交时发生错误，请稍后重试。",
    doneTitle: "提交完成",
    doneThanks: "感谢您通过合作伙伴表单提交咨询。",
    doneNote:
      "我们将在2～3个工作日内回复。若未收到回复，请检查垃圾邮件或换用其他邮箱再次咨询。",
  },
};

export const WHOLESALE_TEXTS: Record<
  Locale,
  {
    h1: string;
    tagline: string;
    p1: string;
    p2: string;
    p3: string;
    altImage: string;
  }
> = {
  ja: {
    h1: "パートナー募集（卸売り）",
    tagline: "「コーヒー以外もちゃんとおいしい」お店に",
    p1:
      "コーヒーホッピングをしていると、３件目くらいでカフェイン以外のものが欲しくなりませんか？私はいつもレモネードを頼んでしまいます。そんなとき、コーヒーの代わりの選択肢として、藤八茶寮の緑茶ラテやほうじ茶ラテはいかがでしょうか。",
    p2:
      "純度100%混じりっ気無しの粉末茶なので、甘さ加減は店舗で調整が可能です。800メッシュの粒度まで細かくし、冷たい水や牛乳にも溶けやすく、なめらかな口当たりをめざしました。ドリンクだけでなくスイーツの材料にもご利用いただけます。",
    p3:
      "扱いやすく、オペレーションもスムーズなパウダーシリーズで、「コーヒー以外もちゃんとおいしい」に。",
    altImage: "パートナー募集・伊勢茶をビジネスに",
  },
  en: {
    h1: "Partner programme (wholesale)",
    tagline: "For cafés that want to offer more than just great coffee",
    p1:
      "When you're hopping from one coffee shop to the next, don't you sometimes want something beyond caffeine? We often end up ordering lemonade. How about our matcha latte or hojicha latte from Fujihachiya as an alternative to coffee?",
    p2:
      "Our powder is 100% tea with no additives, so you can adjust sweetness to suit your shop. We mill it to 800 mesh so it dissolves easily in cold water or milk for a smooth finish. Use it not only for drinks but also in desserts.",
    p3:
      "Easy to handle and smooth to work with—our powder series helps you offer more than just great coffee.",
    altImage: "Partner programme – Ise tea for business",
  },
  ko: {
    h1: "파트너 모집 (도매)",
    tagline: "「커피 말고도 맛있는」 가게를 위해",
    p1:
      "커피숍을 돌아다니다 보면 세 번째쯤엔 카페인 말고 다른 게 땡기지 않나요? 저는 항상 레모네이드를 시키곤 합니다. 그럴 때 커피 대신 후지하치야의 녹차 라떼나 호지차 라떼는 어떠세요?",
    p2:
      "순도 100% 무첨가 파우더 차라 당도는 매장에서 조절할 수 있습니다. 800 메쉬까지 갈아서 찬물이나 우유에도 잘 녹고 부드러운 식감을 내었습니다. 음료뿐 아니라 디저트 재료로도 이용하실 수 있습니다.",
    p3:
      "다루기 쉽고 오퍼레이션도 수월한 파우더 시리즈로 「커피 말고도 맛있는」 가게를.",
    altImage: "파트너 모집·이세차를 비즈니스에",
  },
  zh: {
    h1: "合作伙伴招募（批发）",
    tagline: "打造「不止咖啡好喝」的店铺",
    p1:
      "一家家喝咖啡时，是不是第三家左右就想来点咖啡因以外的？我们总会点柠檬汁。这时，不妨试试藤八茶寮的抹茶拿铁或焙茶拿铁作为咖啡的替代选择。",
    p2:
      "100%纯茶粉无添加，甜度可在店内调整。研磨至800目，易溶于冷水或牛奶，口感顺滑。除饮品外也可用于甜点。",
    p3:
      "易操作、流程顺畅的粉末系列，助您实现「不止咖啡好喝」。",
    altImage: "合作伙伴招募·伊势茶商用",
  },
};
