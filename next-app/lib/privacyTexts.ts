import type { Locale } from "./i18n";

type PrivacySection =
  | { title: string; intro?: string; body: string }
  | { title: string; intro?: string; body: string[] };

export const PRIVACY_TEXTS: Record<
  Locale,
  { h1: string; intro: string; sections: PrivacySection[] }
> = {
  ja: {
    h1: "プライバシーポリシー",
    intro:
      "当ショップは、お客様の個人情報保護の重要性について認識し、個人情報の保護に関する法律（以下「個人情報保護法」といいます。）を遵守すると共に、以下のプライバシーポリシー（以下「本プライバシーポリシー」といいます。）に従い、適切な取扱い及び保護に努めます。",
    sections: [
      {
        title: "1．個人情報の定義",
        body:
          "本プライバシーポリシーにおいて、個人情報とは、個人情報保護法第2条第1項により定義された個人情報、すなわち、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含みます。）、もしくは個人識別符号が含まれる情報を意味します。",
      },
      {
        title: "2．個人情報の利用目的",
        intro: "当ショップは、お客様の個人情報を、以下の目的で利用いたします。",
        body: [
          "当ショップサービスの提供のため",
          "当ショップサービスに関するご案内、お問い合わせ等への対応のため",
          "当ショップの商品、サービス等のご案内のため",
          "当ショップサービスに関する規約等に違反する行為に対する対応のため",
          "当ショップサービスに関する規約等の変更などを通知するため",
          "当ショップサービスの改善、新サービスの開発等に役立てるため",
          "当ショップサービスに関連して、個人を識別できない形式に加工した統計データを作成するため",
          "その他、上記利用目的に付随する目的のため",
        ],
      },
      {
        title: "3．個人情報利用目的の変更",
        body:
          "当ショップは、個人情報の利用目的を、関連性を有すると合理的に認められる範囲内において変更することがあり、変更した場合にはお客様に通知又は本サイト上で公表します。",
      },
      {
        title: "4．個人情報利用の制限",
        intro:
          "当ショップは、個人情報保護法その他の法令により許容される場合を除き、お客様の同意を得ず、利用目的の達成に必要な範囲を超えて個人情報を取り扱いません。ただし、次の場合はこの限りではありません。",
        body: [
          "法令に基づく場合",
          "人の生命、身体又は財産の保護のために必要がある場合であって、お客様の同意を得ることが困難であるとき",
          "公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、お客様の同意を得ることが困難であるとき",
          "国の機関もしくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに協力する必要がある場合であって、お客様の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき",
        ],
      },
      {
        title: "5．個人情報の適正な取得",
        body:
          "当ショップは、適正に個人情報を取得し、偽りその他不正の手段により取得しません。",
      },
      {
        title: "6．個人情報の安全管理",
        body:
          "当ショップは、個人情報の紛失、破壊、改ざん及び漏洩などのリスクに対して、個人情報の安全管理が図られるよう、従業員に対し必要かつ適切な監督を行います。また、個人情報の取扱いの全部又は一部を委託する場合は、委託先において個人情報の安全管理が図られるよう、必要かつ適切な監督を行います。",
      },
      {
        title: "7．第三者提供",
        intro:
          "当ショップは、個人情報保護法その他の法令に基づき開示が認められる場合を除き、あらかじめお客様の同意を得ないで、個人情報を第三者に提供しません。ただし、次に掲げる場合は、上記に定める第三者への提供には該当しません。",
        body: [
          "当ショップが利用目的の達成に必要な範囲内において個人情報の取扱いの全部又は一部を委託する場合",
          "合併その他の事由による事業の承継に伴って個人情報が提供される場合",
          "個人情報保護法の定めに基づき共同利用する場合",
        ],
      },
      {
        title: "8．個人情報の開示",
        body:
          "当ショップは、お客様から、個人情報保護法の定めに基づき個人情報の開示を求められたときは、お客様ご本人からのご請求であることを確認の上で、お客様に対し遅滞なく開示を行います（当該個人情報が存在しないときにはその旨を通知いたします。）。ただし、個人情報保護法その他の法令により、当ショップが開示の義務を負わない場合は、この限りではありません。",
      },
      {
        title: "9．個人情報の訂正等",
        body:
          "当ショップは、お客様から、個人情報が真実でないという理由によって、個人情報保護法の定めに基づきその内容の訂正、追加又は削除（以下「訂正等」といいます。）を求められた場合には、お客様ご本人からのご請求であることを確認の上で、利用目的の達成に必要な範囲内において遅滞なく必要な調査を行い、その結果に基づき、個人情報の内容の訂正等を行い、その旨をお客様に通知します（訂正等を行わない旨の決定をしたときは、お客様に対しその旨を通知いたします。）。ただし、個人情報保護法その他の法令により、当ショップが訂正等の義務を負わない場合は、この限りではありません。",
      },
      {
        title: "10．個人情報の利用停止等",
        body:
          "当ショップは、お客様から、お客様の個人情報が、あらかじめ公表された利用目的の範囲を超えて取り扱われているという理由又は偽りその他不正の手段により取得されたものであるという理由により、個人情報保護法の定めに基づきその利用の停止又は消去（以下「利用停止等」といいます。）を求められた場合において、そのご請求に理由があることが判明した場合には、お客様ご本人からのご請求であることを確認の上で、遅滞なく個人情報の利用停止等を行い、その旨をお客様に通知します。ただし、個人情報保護法その他の法令により、当ショップが利用停止等の義務を負わない場合は、この限りではありません。",
      },
      {
        title: "11．Cookie（クッキー）その他の技術の利用",
        body:
          "当ショップのサービスは、Cookie及びこれに類する技術を利用することがあります。これらの技術は、当ショップによる本サービスの利用状況等の把握に役立ち、サービス向上に資するものです。Cookieを無効化されたいお客様は、ウェブブラウザの設定を変更することによりCookieを無効化することができます。ただし、Cookieを無効化すると、本サービスの一部の機能をご利用いただけなくなる場合があります。",
      },
      {
        title: "12．お問い合わせ窓口",
        body:
          "開示等のお申出、ご意見、ご質問、苦情のお申出その他個人情報の取扱いに関するお問い合わせは、本サイト内のお問い合わせフォーム又は特定商取引法に基づく表記に記載の連絡先までご連絡ください。",
      },
      {
        title: "13．継続的改善",
        body:
          "当ショップは、個人情報の取扱いに関する運用状況を適宜見直し、継続的な改善に努めるものとし、必要に応じて本プライバシーポリシーを変更することがあります。",
      },
    ],
  },
  en: {
    h1: "Privacy Policy",
    intro:
      "We recognise the importance of protecting your personal information and comply with the Act on the Protection of Personal Information (the \"Personal Information Protection Act\"). In accordance with this Privacy Policy, we strive to handle and protect your personal information appropriately.",
    sections: [
      {
        title: "1. Definition of personal information",
        body:
          "In this Privacy Policy, \"personal information\" means personal information as defined in Article 2(1) of the Personal Information Protection Act: information about a living individual that can identify a specific person by name, date of birth or other description (including information that can be cross-referenced to identify a specific person), or that contains an individual identification code.",
      },
      {
        title: "2. Purposes of use",
        intro: "We use your personal information for the following purposes.",
        body: [
          "To provide our shop services",
          "To respond to enquiries and communications about our services",
          "To inform you about our products and services",
          "To address conduct that violates our terms and conditions",
          "To notify you of changes to our terms and conditions",
          "To improve our services and develop new ones",
          "To create statistics in a form that does not identify individuals",
          "Other purposes incidental to the above",
        ],
      },
      {
        title: "3. Changes to purposes of use",
        body:
          "We may change the purposes of use within a reasonably related scope and will notify you or publish the change on this site.",
      },
      {
        title: "4. Limitation of use",
        intro:
          "Except as permitted by the Personal Information Protection Act or other laws, we will not handle your personal information beyond what is necessary to achieve the purposes of use without your consent. The following cases are excepted.",
        body: [
          "When required by law",
          "When necessary to protect life, body or property and it is difficult to obtain consent",
          "When particularly necessary for public health or child welfare and it is difficult to obtain consent",
          "When cooperation with national or local government is required and obtaining consent may impede execution of their duties",
        ],
      },
      {
        title: "5. Proper acquisition",
        body:
          "We acquire personal information properly and do not obtain it by deception or other improper means.",
      },
      {
        title: "6. Security management",
        body:
          "We supervise our personnel as necessary to prevent loss, destruction, alteration or leakage of personal information. When we outsource all or part of the handling of personal information, we supervise the outsourced party as necessary to ensure proper security.",
      },
      {
        title: "7. Provision to third parties",
        intro:
          "We do not provide personal information to third parties without your prior consent, except where disclosure is permitted by the Personal Information Protection Act or other laws. The following cases do not constitute provision to third parties as defined above.",
        body: [
          "When we outsource handling of personal information within the scope necessary to achieve the purposes of use",
          "When personal information is provided in connection with business succession due to merger or other reasons",
          "When personal information is used jointly in accordance with the Personal Information Protection Act",
        ],
      },
      {
        title: "8. Disclosure",
        body:
          "When you request disclosure of your personal information in accordance with the Personal Information Protection Act, we will verify your identity and disclose the information without delay (or notify you if it does not exist). This does not apply where we are not obliged to disclose under the Act or other laws.",
      },
      {
        title: "9. Correction etc.",
        body:
          "When you request correction, addition or deletion of your personal information on the grounds that it is not accurate, we will verify your identity, conduct necessary investigation without delay within the scope necessary to achieve the purposes of use, and correct the information and notify you (or notify you if we decide not to make the correction). This does not apply where we are not obliged to do so under the Act or other laws.",
      },
      {
        title: "10. Suspension of use etc.",
        body:
          "When you request suspension or deletion of use of your personal information on the grounds that it is being handled beyond the published purposes of use or was obtained by deception or other improper means, and we find the request to have merit, we will verify your identity and suspend use or delete the information without delay and notify you. This does not apply where we are not obliged to do so under the Act or other laws.",
      },
      {
        title: "11. Use of cookies and similar technologies",
        body:
          "Our service may use cookies and similar technologies. These help us understand how our service is used and improve the service. You can disable cookies in your browser settings. Note that disabling cookies may prevent you from using some features of the service.",
      },
      {
        title: "12. Contact",
        body:
          "For requests for disclosure, opinions, questions, complaints or other enquiries regarding the handling of personal information, please use the contact form on this site or the contact details in our legal notice.",
      },
      {
        title: "13. Continuous improvement",
        body:
          "We will review our handling of personal information from time to time and strive for continuous improvement. We may change this Privacy Policy as necessary.",
      },
    ],
  },
  ko: {
    h1: "개인정보 처리방침",
    intro:
      "당숍은 고객의 개인정보 보호의 중요성을 인식하고, 개인정보 보호법을 준수하며, 본 개인정보 처리방침에 따라 적절한 취급 및 보호에 노력합니다.",
    sections: [
      {
        title: "1. 개인정보의 정의",
        body:
          "본 처리방침에서 개인정보란 개인정보 보호법 제2조 제1항에 정의된 개인정보, 즉 생존하는 개인에 관한 정보로서 해당 정보에 포함된 성명·생년월일 기타 기술 등에 의해 특정 개인을 식별할 수 있는 것(다른 정보와 쉽게 대조하여 특정 개인을 식별할 수 있게 되는 것을 포함합니다), 또는 개인식별부호가 포함된 정보를 의미합니다.",
      },
      {
        title: "2. 개인정보의 이용 목적",
        intro: "당숍은 고객의 개인정보를 다음 목적으로 이용합니다.",
        body: [
          "당숍 서비스 제공을 위하여",
          "당숍 서비스에 관한 안내·문의 등에 대응하기 위하여",
          "당숍의 상품·서비스 등의 안내를 위하여",
          "당숍 서비스에 관한 약관 등 위반 행위에 대한 대응을 위하여",
          "당숍 서비스에 관한 약관 등의 변경을 통지하기 위하여",
          "당숍 서비스 개선·신규 서비스 개발 등에 활용하기 위하여",
          "당숍 서비스에 관해 개인을 식별할 수 없는 형태로 가공한 통계 데이터를 작성하기 위하여",
          "기타 위 이용 목적에 부수하는 목적을 위하여",
        ],
      },
      {
        title: "3. 이용 목적의 변경",
        body:
          "당숍은 개인정보의 이용 목적을 합리적으로 관련이 있다고 인정되는 범위 내에서 변경할 수 있으며, 변경 시 고객에게 통지하거나 본 사이트에 공개합니다.",
      },
      {
        title: "4. 이용의 제한",
        intro:
          "당숍은 개인정보 보호법 기타 법령에 의해 허용되는 경우를 제외하고, 고객의 동의 없이 이용 목적 달성에 필요한 범위를 초과하여 개인정보를 취급하지 않습니다. 다만 다음의 경우는 이에 해당하지 않습니다.",
        body: [
          "법령에 따른 경우",
          "인명·신체 또는 재산의 보호에 필요하고 고객의 동의를 얻기 어려운 경우",
          "공중위생의 향상 또는 아동의 건전한 육성 추진에 특히 필요하고 고객의 동의를 얻기 어려운 경우",
          "국가 기관 또는 지방공공단체 또는 그 위탁을 받은 자가 법령이 정하는 사무를 수행하는 데 협력할 필요가 있고, 고객의 동의를 얻으면 해당 사무 수행에 지장을 줄 우려가 있는 경우",
        ],
      },
      {
        title: "5. 적정한 취득",
        body:
          "당숍은 적정하게 개인정보를 취득하며, 거짓 기타 부정한 수단으로 취득하지 않습니다.",
      },
      {
        title: "6. 안전 관리",
        body:
          "당숍은 개인정보의 분실·파괴·변조 및 유출 등의 위험에 대해 안전 관리가 이루어지도록 직원에 대해 필요 적절한 감독을 합니다. 또한 개인정보 취급의 전부 또는 일부를 위탁하는 경우, 수탁자에서 안전 관리가 이루어지도록 필요 적절한 감독을 합니다.",
      },
      {
        title: "7. 제3자 제공",
        intro:
          "당숍은 개인정보 보호법 기타 법령에 따라 개시가 인정되는 경우를 제외하고, 사전에 고객의 동의를 얻지 않고 개인정보를 제3자에 제공하지 않습니다. 다만 다음에 해당하는 경우 위에서 정한 제3자 제공에 해당하지 않습니다.",
        body: [
          "당숍이 이용 목적 달성에 필요한 범위 내에서 개인정보 취급의 전부 또는 일부를 위탁하는 경우",
          "합병 기타 사유에 의한 사업의 승계에 따라 개인정보가 제공되는 경우",
          "개인정보 보호법의 정에 따라 공동 이용하는 경우",
        ],
      },
      {
        title: "8. 개시",
        body:
          "당숍은 고객으로부터 개인정보 보호법의 정에 따라 개인정보의 개시를 요청받은 경우, 본인으로부터의 요청임을 확인한 후 고객에게 지체 없이 개시합니다(해당 개인정보가 존재하지 않을 때는 그 취지를 통지합니다). 다만 개인정보 보호법 기타 법령에 따라 당숍이 개시 의무를 지지 않는 경우는 이에 해당하지 않습니다.",
      },
      {
        title: "9. 정정 등",
        body:
          "당숍은 고객으로부터 개인정보가 사실이 아니라는 이유로 정정·추가 또는 삭제를 요청받은 경우, 본인으로부터의 요청임을 확인한 후 이용 목적 달성에 필요한 범위 내에서 지체 없이 필요한 조사를 하고, 그 결과에 따라 정정 등を行い 고객에게 통지합니다(정정 등을 하지 않기로 한 때는 그 취지를 통지합니다). 다만 개인정보 보호법 기타 법령에 따라 당숍이 정정 등 의무를 지지 않는 경우는 이에 해당하지 않습니다.",
      },
      {
        title: "10. 이용 정지 등",
        body:
          "당숍은 고객으로부터 개인정보가 사전에 공표된 이용 목적의 범위를 초과하여 취급되고 있다는 이유 또는 거짓 기타 부정한 수단으로 취득된 것이라는 이유로 이용의 정지 또는 삭제를 요청받은 경우, 그 요청에 이유가 있다고 판명된 때에는 본인으로부터의 요청임을 확인한 후 지체 없이 이용 정지 등을 하고 고객에게 통지합니다. 다만 개인정보 보호법 기타 법령에 따라 당숍이 이용 정지 등 의무를 지지 않는 경우는 이에 해당하지 않습니다.",
      },
      {
        title: "11. 쿠키 등 기술의 이용",
        body:
          "당숍 서비스는 쿠키 및 이에 유사한 기술을 이용할 수 있습니다. 이러한 기술은 당숍이 본 서비스의 이용 상황 등을 파악하는 데 도움이 되며 서비스 향상에 기여합니다. 쿠키를 무효화하려는 고객은 웹 브라우저 설정을 변경하여 쿠키를 무효화할 수 있습니다. 다만 쿠키를 무효화하면 본 서비스의 일부 기능을 이용할 수 없게 될 수 있습니다.",
      },
      {
        title: "12. 문의 창구",
        body:
          "개시 등의 신청, 의견, 질문, 불만 신청 기타 개인정보 취급에 관한 문의는 본 사이트 내 문의 양식 또는 특정 상거래에 관한 법률에 기반한 표기에 기재된 연락처까지 연락해 주세요.",
      },
      {
        title: "13. 지속적 개선",
        body:
          "당숍은 개인정보 취급에 관한 운영 상황을 적절히 검토하고 지속적인 개선에 노력하며, 필요에 따라 본 개인정보 처리방침을 변경할 수 있습니다.",
      },
    ],
  },
  zh: {
    h1: "隐私政策",
    intro:
      "本店认识到保护客户个人信息的重要性，遵守《个人信息保护法》，并依据本隐私政策，努力妥善处理与保护您的个人信息。",
    sections: [
      {
        title: "1. 个人信息的定义",
        body:
          "本隐私政策所称个人信息，系指《个人信息保护法》第2条第1款所定义的个人信息，即与生存中的个人相关的、可通过该信息中所含姓名、出生日期及其他描述等识别特定个人的信息（包括可与其他信息对照从而识别特定个人的信息），或含有个人识别符号的信息。",
      },
      {
        title: "2. 个人信息的利用目的",
        intro: "本店将客户的个人信息用于下列目的。",
        body: [
          "提供本店服务",
          "应对与本店服务相关的咨询与联络",
          "介绍本店商品与服务",
          "应对违反本店服务相关条款等的行为",
          "通知本店服务相关条款等的变更",
          "用于本店服务的改进与新服务的开发",
          "制作与本店服务相关、无法识别个人的统计资料",
          "其他附带于上述利用目的之目的",
        ],
      },
      {
        title: "3. 利用目的的变更",
        body:
          "本店可能在合理相关范围内变更个人信息的利用目的，变更时将通知客户或在本网站公布。",
      },
      {
        title: "4. 利用限制",
        intro:
          "除《个人信息保护法》及其他法令允许的情形外，本店未经客户同意，不会超出实现利用目的所需范围处理个人信息。但下列情形不在此限。",
        body: [
          "依据法令时",
          "为保护生命、身体或财产所必需且难以获得客户同意时",
          "为增进公共卫生或促进儿童健康成长所特别需要且难以获得客户同意时",
          "国家机关或地方公共团体或其受托人执行法令规定事务需要协助，且获得客户同意可能妨碍该事务执行时",
        ],
      },
      {
        title: "5. 正当取得",
        body:
          "本店正当取得个人信息，不以欺骗及其他不正当手段取得。",
      },
      {
        title: "6. 安全管理",
        body:
          "本店为防止个人信息丢失、毁损、篡改及泄露等风险，对员工进行必要且适当的监督。在将个人信息的处理全部或部分委托他人时，对受托方进行必要且适当的监督，确保其做好安全管理。",
      },
      {
        title: "7. 向第三方提供",
        intro:
          "除《个人信息保护法》及其他法令允许披露的情形外，本店未经客户事先同意，不向第三方提供个人信息。下列情形不构成上述所称向第三方提供。",
        body: [
          "本店在实现利用目的所需范围内将个人信息的处理全部或部分委托他人时",
          "因合并等其他事由承继业务而提供个人信息时",
          "依据《个人信息保护法》规定进行共同利用时",
        ],
      },
      {
        title: "8. 披露",
        body:
          "客户依据《个人信息保护法》规定请求披露个人信息时，本店在确认系本人请求后，将及时披露（若该个人信息不存在则通知该情况）。但依《个人信息保护法》及其他法令本店不负披露义务时不适用。",
      },
      {
        title: "9. 订正等",
        body:
          "客户以个人信息不实为由，依据《个人信息保护法》规定请求订正、补充或删除时，本店在确认系本人请求后，将在实现利用目的所需范围内及时进行必要调查，并根据结果进行订正等并通知客户（若决定不予订正等则通知该情况）。但依《个人信息保护法》及其他法令本店不负订正等义务时不适用。",
      },
      {
        title: "10. 利用停止等",
        body:
          "客户以个人信息超出事先公布的利用目的范围被处理，或以欺骗及其他不正当手段取得为由，依据《个人信息保护法》规定请求停止利用或删除时，若认定请求有理，本店在确认系本人请求后，将及时停止利用或删除并通知客户。但依《个人信息保护法》及其他法令本店不负利用停止等义务时不适用。",
      },
      {
        title: "11. Cookie等技术的使用",
        body:
          "本店服务可能使用Cookie及类似技术。这些技术有助于掌握本服务的使用情况并改善服务。希望禁用Cookie的客户可通过更改浏览器设置禁用。但禁用Cookie后，可能无法使用本服务的部分功能。",
      },
      {
        title: "12. 咨询窗口",
        body:
          "关于披露等申请、意见、疑问、投诉及其他个人信息处理事宜，请通过本网站内的咨询表单或《特定商业交易法》所载联系方式与我们联系。",
      },
      {
        title: "13. 持续改进",
        body:
          "本店将适时审视个人信息处理方面的运作情况，努力持续改进，并可能根据需要变更本隐私政策。",
      },
    ],
  },
};
