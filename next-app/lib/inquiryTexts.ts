import type { Locale } from "./i18n";

export const INQUIRY_TEXTS: Record<
  Locale,
  {
    heading: string;
    intro: string;
    name: string;
    email: string;
    message: string;
    required: string;
    errName: string;
    errEmail: string;
    errEmailInvalid: string;
    errMessage: string;
    emailNote: string;
    confirmButton: string;
    confirmIntro: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
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
    heading: "お問い合わせ",
    intro:
      "商品や伊勢茶に関するご質問、業務用・卸売りのご相談、イベント出店のご依頼などがございましたら、下記フォームよりお気軽にお送りください。",
    name: "お名前",
    email: "Eメール",
    message: "メッセージ",
    required: "（必須）",
    errName: "お名前を入力してください。",
    errEmail: "Eメールアドレスを入力してください。",
    errEmailInvalid: "Eメールアドレスの形式が正しくありません。",
    errMessage: "メッセージを入力してください。",
    emailNote: "",
    confirmButton: "確認する",
    confirmIntro: "入力内容をご確認ください。修正する場合は「戻る」を、送信する場合は「送信する」を押してください。",
    nameLabel: "お名前",
    emailLabel: "Eメール",
    messageLabel: "メッセージ",
    back: "戻る",
    submit: "送信する",
    sending: "送信中...",
    sendError: "送信中にエラーが発生しました。お手数ですが、時間をおいて再度お試しください。",
    doneTitle: "お問い合わせ送信完了",
    doneThanks: "お問い合わせありがとうございます。",
    doneNote:
      "内容を確認のうえ、通常2〜3営業日以内にご返信させていただきます。しばらく経っても返信が届かない場合は、迷惑メールフォルダをご確認いただくか、別のメールアドレスにて再度お問い合わせください。",
  },
  en: {
    heading: "Contact",
    intro:
      "For questions about our products or Ise tea, wholesale enquiries, or event stall requests, please use the form below.",
    name: "Name",
    email: "Email",
    message: "Message",
    required: "(required)",
    errName: "Please enter your name.",
    errEmail: "Please enter your email address.",
    errEmailInvalid: "Please enter a valid email address.",
    errMessage: "Please enter your message.",
    emailNote: "",
    confirmButton: "Confirm",
    confirmIntro: 'Please check the details below. Click "Back" to edit or "Submit" to send.',
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    back: "Back",
    submit: "Submit",
    sending: "Sending...",
    sendError: "Something went wrong. Please try again later.",
    doneTitle: "Message sent",
    doneThanks: "Thank you for your message.",
    doneNote:
      "We will reply within 2–3 business days. If you don't hear from us, please check your spam folder or try another email address.",
  },
  ko: {
    heading: "문의",
    intro:
      "상품이나 이세차에 관한 문의, 업무용·도매 상담, 이벤트 출점 요청 등이 있으시면 아래 양식으로 보내 주세요.",
    name: "이름",
    email: "이메일",
    message: "메시지",
    required: "（필수）",
    errName: "이름을 입력해 주세요.",
    errEmail: "이메일 주소를 입력해 주세요.",
    errEmailInvalid: "이메일 형식이 올바르지 않습니다.",
    errMessage: "메시지를 입력해 주세요.",
    emailNote: "",
    confirmButton: "확인",
    confirmIntro: "입력 내용을 확인해 주세요. 수정하려면 「돌아가기」를, 전송하려면 「전송」을 누르세요.",
    nameLabel: "이름",
    emailLabel: "이메일",
    messageLabel: "메시지",
    back: "돌아가기",
    submit: "전송",
    sending: "전송 중...",
    sendError: "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    doneTitle: "문의 전송 완료",
    doneThanks: "문의해 주셔서 감사합니다.",
    doneNote:
      "내용 확인 후 보통 2~3 영업일 이내에 답변드리겠습니다. 답변이 오지 않으면 스팸 폴더를 확인하시거나 다른 이메일로 다시 문의해 주세요.",
  },
  zh: {
    heading: "咨询",
    intro:
      "如有关于商品或伊势茶的疑问、批发咨询或活动摊位申请，请通过下方表单提交。",
    name: "姓名",
    email: "电子邮箱",
    message: "留言",
    required: "（必填）",
    errName: "请输入您的姓名。",
    errEmail: "请输入电子邮箱。",
    errEmailInvalid: "请输入有效的电子邮箱地址。",
    errMessage: "请输入留言内容。",
    emailNote: "",
    confirmButton: "确认",
    confirmIntro: "请确认以下内容。修改请点「返回」，提交请点「提交」。",
    nameLabel: "姓名",
    emailLabel: "电子邮箱",
    messageLabel: "留言",
    back: "返回",
    submit: "提交",
    sending: "提交中...",
    sendError: "提交时发生错误，请稍后重试。",
    doneTitle: "咨询已提交",
    doneThanks: "感谢您的咨询。",
    doneNote:
      "我们将在2～3个工作日内回复。若未收到回复，请检查垃圾邮件或换用其他邮箱再次咨询。",
  },
};
