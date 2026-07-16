import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getCurrentUser } from "@/lib/supabase/server";

export const metadata = { title: "Inquiries" };

export default async function AthleteInquiries() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, subject, message, status, created_at, users:sender_id(email)")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="font-display text-2xl font-extrabold">Inquiries</h1>
      <p className="mt-1 text-sm text-muted">Messages from brands interested in working with you.</p>

      <div className="mt-8 space-y-4">
        {(inquiries ?? []).length === 0 && (
          <Card className="p-8 text-center text-sm text-muted">No inquiries yet.</Card>
        )}
        {(inquiries ?? []).map((i: any) => (
          <Card key={i.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{i.subject}</div>
                <div className="mt-0.5 text-xs text-muted">{i.users?.email ?? "Unknown sender"}</div>
              </div>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-muted">
                {i.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{i.message}</p>
            <div className="mt-3 text-xs text-muted">
              {new Date(i.created_at).toLocaleString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
