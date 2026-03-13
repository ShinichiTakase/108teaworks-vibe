import CartPageContent from "@/components/CartPageContent";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LocalizedCartPage({ params }: Props) {
  await params;
  return <CartPageContent />;
}
