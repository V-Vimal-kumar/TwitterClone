import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import FeedLayout from "@/components/layout/FeedLayout";

export default function FeedPage() {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <AppLayout>
      <FeedLayout />
    </AppLayout>
  );
}
