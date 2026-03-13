import type { Locale } from "./i18n";

export const CHACHAMARU_TEXTS: Record<
  Locale,
  {
    fabAriaLabel: string;
    fabLabel: string;
    avatarAlt: string;
    greeting: string;
    closeAriaLabel: string;
    inputPlaceholder: string;
    sendButton: string;
    thinking: string;
  }
> = {
  ja: {
    fabAriaLabel: "茶々丸と話す",
    fabLabel: "茶々丸と話す",
    avatarAlt: "茶々丸",
    greeting: "どんな御用ですか?",
    closeAriaLabel: "閉じる",
    inputPlaceholder: "メッセージを入力",
    sendButton: "送信",
    thinking: "考え中…",
  },
  en: {
    fabAriaLabel: "Chat with Chachamaru",
    fabLabel: "Chat with Chachamaru",
    avatarAlt: "Chachamaru",
    greeting: "How can I help?",
    closeAriaLabel: "Close",
    inputPlaceholder: "Type a message",
    sendButton: "Send",
    thinking: "Thinking…",
  },
  ko: {
    fabAriaLabel: "차차마루와 대화하기",
    fabLabel: "차차마루와 대화하기",
    avatarAlt: "차차마루",
    greeting: "무엇을 도와드릴까요?",
    closeAriaLabel: "닫기",
    inputPlaceholder: "메시지 입력",
    sendButton: "전송",
    thinking: "생각 중…",
  },
  zh: {
    fabAriaLabel: "与茶茶丸对话",
    fabLabel: "与茶茶丸对话",
    avatarAlt: "茶茶丸",
    greeting: "有什么可以帮您？",
    closeAriaLabel: "关闭",
    inputPlaceholder: "输入消息",
    sendButton: "发送",
    thinking: "思考中…",
  },
};
