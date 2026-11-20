import type { Metadata } from "next";
import { resolveLang } from "@/lib/page";
import AdminLayout from "@/components/admin/AdminLayout";
import KhalilabadArmyAdminView from "@/components/admin/KhalilabadArmyAdminView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await resolveLang(params);
  return {
    title: lang === "hi" ? "खलीलाबाद आर्मी सदस्य प्रबंधन | Admin" : "Khalilabad Army Members | Admin",
    robots: { index: false, follow: false },
  };
}

export default async function AdminKhalilabadArmyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await resolveLang(params);

  return (
    <AdminLayout lang={lang} activeTab="khalilabad-army">
      <KhalilabadArmyAdminView lang={lang} />
    </AdminLayout>
  );
}
