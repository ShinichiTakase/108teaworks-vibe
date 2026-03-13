import type { Locale } from "@/lib/i18n";

export const CHECKOUT_TEXTS: Record<
  Locale,
  {
    title: string;
    empty: string;
    goToProducts: string;
    continueShopping: string;
    orderSummary: string;
    remove: string;
    subtotal: string;
    shipping: string;
    totalTaxIncluded: string;
    taxIncludedLinePrefix: string; // "（消費税"
    taxIncludedLineSuffix: string; // "を含む）"
    calculating: string;
    promoApproval: string;
    paymentMethod: string;
    stripeKeyMissing: string;
    cardOrGooglePay: string;
    walletHint: string;
    payNow: string;
    paying: string;
    paymentLoading: string;
    shippingRequiredToPay: string;
    enterAddressForShipping: string;
    billing: string;
    autofillPrevious: string;
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine: string;
    searchingAddress: string;
    selectAddressCandidate: string;
    giftNoInvoice: string;
    memo: string;
    memoPlaceholder: string;
    shipToDifferent: string;
    shippingAddress: string;
    recipientName: string;
    recipientPhone: string;
    recipientPostalCode: string;
    paymentInitFailed: string;
    addressNotFound: string;
    addressLookupFailed: string;
    paymentElementAlert: string;
    paymentFailed: string;
    statusCheckFailed: string;
    emailSendFailed: string;
    paymentProcessingError: string;
    qtyDecrease: string;
    qtyIncrease: string;
  }
> = {
  ja: {
    title: "購入手続き",
    empty: "カートに商品がありません。",
    goToProducts: "商品一覧へ",
    continueShopping: "買い物を続ける",
    orderSummary: "注文内容",
    remove: "削除",
    subtotal: "小計",
    shipping: "送料",
    totalTaxIncluded: "合計（税込）",
    taxIncludedLinePrefix: "（消費税",
    taxIncludedLineSuffix: "を含む）",
    calculating: "計算中",
    promoApproval: "藤八茶寮からのお得な情報を受け取る",
    paymentMethod: "支払い方法",
    stripeKeyMissing:
      "Stripeの公開鍵が未設定です（`NEXT_PUBLIC_STRIPE_PUBLIC_KEY`）。`.env.local` を設定して再起動してください。",
    cardOrGooglePay: "クレジットカードまたは Google Pay",
    walletHint: "Apple Pay / Google Pay が利用できる端末では、ここにボタンが表示されます。",
    payNow: "購入を確定する",
    paying: "決済処理中...",
    paymentLoading: "支払い方法を読み込み中…",
    shippingRequiredToPay: "送料を計算するため、まず郵便番号・住所を入力してください。",
    enterAddressForShipping: "※ カードの場合は上で郵便番号・住所を入力してください。Apple Pay・Google Pay ではウォレットの配送先で送料を計算します。",
    billing: "請求先",
    autofillPrevious: "前回の情報を自動入力",
    name: "お名前",
    email: "メールアドレス",
    phone: "電話番号",
    postalCode: "郵便番号",
    prefecture: "都道府県",
    city: "市区町村",
    addressLine: "住所（番地・建物名など）",
    searchingAddress: "住所を検索中...",
    selectAddressCandidate: "住所の候補を選択してください",
    giftNoInvoice: "金額記載の明細書は不要（ギフト用）",
    memo: "注文に関するメモ",
    memoPlaceholder: "ご要望などがございましたらご記入ください",
    shipToDifferent: "別の住所へ配送しますか？",
    shippingAddress: "送付先",
    recipientName: "氏名",
    recipientPhone: "電話番号",
    recipientPostalCode: "〒（郵便番号）",
    paymentInitFailed: "支払い情報の初期化に失敗しました。",
    addressNotFound: "住所が見つかりませんでした",
    addressLookupFailed: "住所の取得に失敗しました",
    paymentElementAlert: "支払い方法のブロックから決済してください。",
    paymentFailed: "決済に失敗しました。",
    statusCheckFailed: "決済は完了しましたが、状態の確認に失敗しました。",
    emailSendFailed: "決済は完了しましたが、注文メール送信に失敗しました。",
    paymentProcessingError: "決済処理中にエラーが発生しました。",
    qtyDecrease: "数量を減らす",
    qtyIncrease: "数量を増やす",
  },
  en: {
    title: "Checkout",
    empty: "Your cart is empty.",
    goToProducts: "Back to products",
    continueShopping: "Continue shopping",
    orderSummary: "Order summary",
    remove: "Remove",
    subtotal: "Subtotal",
    shipping: "Shipping",
    totalTaxIncluded: "Total (tax included)",
    taxIncludedLinePrefix: "(Tax included: ",
    taxIncludedLineSuffix: ")",
    calculating: "Calculating",
    promoApproval: "Receive special offers from Fujihachi Saryo",
    paymentMethod: "Payment",
    stripeKeyMissing:
      "Stripe public key is not set (`NEXT_PUBLIC_STRIPE_PUBLIC_KEY`). Please update `.env.local` and restart the dev server.",
    cardOrGooglePay: "Card or Google Pay",
    walletHint: "On supported devices, Apple Pay / Google Pay buttons will appear here.",
    payNow: "Place order",
    paying: "Processing...",
    paymentLoading: "Loading payment methods…",
    shippingRequiredToPay: "Please enter your postal code and address first to calculate shipping.",
    enterAddressForShipping: "Apple Pay / Google Pay will appear after shipping is calculated. Enter postal code and address above.",
    billing: "Billing",
    autofillPrevious: "Autofill previous details",
    name: "Name",
    email: "Email",
    phone: "Phone",
    postalCode: "Postal code",
    prefecture: "Prefecture",
    city: "City",
    addressLine: "Address",
    searchingAddress: "Searching address...",
    selectAddressCandidate: "Select an address",
    giftNoInvoice: "No invoice/receipt showing amounts (gift)",
    memo: "Order notes",
    memoPlaceholder: "Write any requests here",
    shipToDifferent: "Ship to a different address?",
    shippingAddress: "Shipping address",
    recipientName: "Name",
    recipientPhone: "Phone",
    recipientPostalCode: "Postal code",
    paymentInitFailed: "Failed to initialize payment information.",
    addressNotFound: "Address not found",
    addressLookupFailed: "Failed to look up address",
    paymentElementAlert: "Please complete the payment in the payment section.",
    paymentFailed: "Payment failed.",
    statusCheckFailed: "Payment succeeded, but we couldn't confirm the status.",
    emailSendFailed: "Payment succeeded, but we couldn't send the order email.",
    paymentProcessingError: "An error occurred while processing the payment.",
    qtyDecrease: "Decrease quantity",
    qtyIncrease: "Increase quantity",
  },
  ko: {
    title: "결제",
    empty: "장바구니에 상품이 없습니다.",
    goToProducts: "상품 목록으로",
    continueShopping: "쇼핑 계속하기",
    orderSummary: "주문 내역",
    remove: "삭제",
    subtotal: "소계",
    shipping: "배송비",
    totalTaxIncluded: "합계(세금 포함)",
    taxIncludedLinePrefix: "(소비세 ",
    taxIncludedLineSuffix: " 포함)",
    calculating: "계산 중",
    promoApproval: "후지하치 사료의 혜택 정보를 받아보기",
    paymentMethod: "결제 방법",
    stripeKeyMissing:
      "Stripe 공개 키가 설정되어 있지 않습니다(`NEXT_PUBLIC_STRIPE_PUBLIC_KEY`). `.env.local`을 설정한 뒤 재시작해 주세요.",
    cardOrGooglePay: "카드 또는 Google Pay",
    walletHint: "지원되는 기기에서는 Apple Pay / Google Pay 버튼이 여기에 표시됩니다.",
    payNow: "구매 확정",
    paying: "결제 처리 중...",
    paymentLoading: "결제 수단을 불러오는 중…",
    shippingRequiredToPay: "배송비를 계산하려면 먼저 우편번호와 주소를 입력해 주세요.",
    enterAddressForShipping: "Apple Pay·Google Pay는 배송비 확정 후 표시됩니다. 위에서 우편번호와 주소를 입력하세요.",
    billing: "청구지",
    autofillPrevious: "이전 정보 자동 입력",
    name: "이름",
    email: "이메일",
    phone: "전화번호",
    postalCode: "우편번호",
    prefecture: "도/현",
    city: "시/구",
    addressLine: "주소",
    searchingAddress: "주소 검색 중...",
    selectAddressCandidate: "주소 후보를 선택해 주세요",
    giftNoInvoice: "금액 기재 명세서 불필요(선물용)",
    memo: "주문 메모",
    memoPlaceholder: "요청 사항이 있으면 입력해 주세요",
    shipToDifferent: "다른 주소로 배송할까요?",
    shippingAddress: "배송지",
    recipientName: "성명",
    recipientPhone: "전화번호",
    recipientPostalCode: "우편번호",
    paymentInitFailed: "결제 정보 초기화에 실패했습니다.",
    addressNotFound: "주소를 찾을 수 없습니다",
    addressLookupFailed: "주소 조회에 실패했습니다",
    paymentElementAlert: "결제 방법 섹션에서 결제를 완료해 주세요.",
    paymentFailed: "결제에 실패했습니다.",
    statusCheckFailed: "결제는 완료되었지만 상태 확인에 실패했습니다.",
    emailSendFailed: "결제는 완료되었지만 주문 메일 전송에 실패했습니다.",
    paymentProcessingError: "결제 처리 중 오류가 발생했습니다.",
    qtyDecrease: "수량 줄이기",
    qtyIncrease: "수량 늘리기",
  },
  zh: {
    title: "结算",
    empty: "购物车为空。",
    goToProducts: "返回商品列表",
    continueShopping: "继续购物",
    orderSummary: "订单内容",
    remove: "删除",
    subtotal: "小计",
    shipping: "运费",
    totalTaxIncluded: "合计（含税）",
    taxIncludedLinePrefix: "（含消费税 ",
    taxIncludedLineSuffix: "）",
    calculating: "计算中",
    promoApproval: "接收来自藤八茶寮的优惠信息",
    paymentMethod: "支付方式",
    stripeKeyMissing:
      "未设置 Stripe 公钥（`NEXT_PUBLIC_STRIPE_PUBLIC_KEY`）。请更新 `.env.local` 并重启开发服务器。",
    cardOrGooglePay: "信用卡或 Google Pay",
    walletHint: "在支持的设备上，这里会显示 Apple Pay / Google Pay 按钮。",
    payNow: "确认购买",
    paying: "处理中...",
    paymentLoading: "正在加载支付方式…",
    shippingRequiredToPay: "请先输入邮政编码和地址以计算运费。",
    enterAddressForShipping: "Apple Pay/Google Pay 将在运费确定后显示。请在上方输入邮政编码和地址。",
    billing: "账单信息",
    autofillPrevious: "自动填入上次信息",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    postalCode: "邮编",
    prefecture: "都道府县",
    city: "市区町村",
    addressLine: "地址",
    searchingAddress: "正在查询地址...",
    selectAddressCandidate: "请选择地址候选",
    giftNoInvoice: "不需要含金额的明细（礼品用）",
    memo: "订单备注",
    memoPlaceholder: "如有需求请填写",
    shipToDifferent: "配送到其他地址？",
    shippingAddress: "收货地址",
    recipientName: "姓名",
    recipientPhone: "电话",
    recipientPostalCode: "邮编",
    paymentInitFailed: "初始化支付信息失败。",
    addressNotFound: "未找到地址",
    addressLookupFailed: "获取地址失败",
    paymentElementAlert: "请在支付方式区块完成支付。",
    paymentFailed: "支付失败。",
    statusCheckFailed: "支付已完成，但状态确认失败。",
    emailSendFailed: "支付已完成，但订单邮件发送失败。",
    paymentProcessingError: "支付处理中发生错误。",
    qtyDecrease: "减少数量",
    qtyIncrease: "增加数量",
  },
};

