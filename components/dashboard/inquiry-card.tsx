"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InquiryChat } from "@/components/dashboard/inquiry-chat";

export function InquiryCard({
  inquiry,
  counterpartLabel,
  currentUserId,
  initialMessages,
}: {
  inquiry: { id: string; subject: string; message: string; status: string; created_at: string };
  counterpartLabel: string;
  currentUserId: string;
  initialMessages: { id: string; sender_id: string; body: string; created_at: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">{inquiry.subject}</div>
          <div className="mt-0.5 text-xs text-muted">{counterpartLabel}</div>
        </div>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-muted">
          {inquiry.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{inquiry.message}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>{new Date(inquiry.created_at).toLocaleString()}</span>
        <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)}>
          <MessageCircle className="h-3.5 w-3.5" /> {open ? "Hide chat" : "Chat"}
        </Button>
      </div>
      {open && (
        <InquiryChat
          inquiryId={inquiry.id}
          currentUserId={currentUserId}
          initialMessages={initialMessages}
        />
      )}
    </Card>
  );
}
