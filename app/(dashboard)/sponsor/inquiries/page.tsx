import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { InquiryCard } from "@/components/dashboard/inquiry-card";

export const metadata = { title: "Inquiries" };

export default async function SponsorInquiries() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, subject, message, status, created_at, users:recipient_id(email)")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false });

  const ids = (inquiries ?? []).map((i) => i.id);
  const { data: messages } = ids.length
    ? await supabase
        .from("messages")
        .select("id, inquiry_id, sender_id, body, created_at")
        .in("inquiry_id", ids)
        .order("created_at", { ascending: true })
    : { data: [] };

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Inquiries</h1>
      <p className="mt-1 text-sm text-muted">Inquiries you've sent to athletes.</p>

      <div className="mt-8 space-y-4">
        {(inquiries ?? []).length === 0 && (
          <Card className="p-8 text-center text-sm text-muted">You haven't sent any inquiries yet.</Card>
        )}
        {(inquiries ?? []).map((i: any) => (
          <InquiryCard
            key={i.id}
            inquiry={i}
            counterpartLabel={i.users?.email ?? "Unknown athlete"}
            currentUserId={user.id}
            initialMessages={(messages ?? []).filter((m) => m.inquiry_id === i.id)}
          />
        ))}
      </div>
    </div>
  );
}
