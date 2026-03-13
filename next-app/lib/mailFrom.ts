/**
 * メール送信元の表示名付きアドレスを返す。
 * From が "藤八茶寮 <info@108teaworks.com>" のように表示されるようにする。
 */
const DEFAULT_FROM_NAME = "藤八茶寮";

export function getMailFrom(address: string): { name: string; address: string } {
  const name = process.env.MAIL_FROM_NAME?.trim() || DEFAULT_FROM_NAME;
  return { name, address };
}
