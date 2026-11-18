import { redirect } from "next/navigation";
import { resolveLang } from "@/lib/page";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await resolveLang(params);
  redirect(`/${lang}/admin/khalilabad-army`);
}
