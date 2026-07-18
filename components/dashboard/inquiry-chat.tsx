"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Message = { id: string; sender_id: string; body: string; created_at: string };

export function InquiryChat({
  inquiryId,
  currentUserId,
  initialMessages,
}: {
  inquiryId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${inquiryId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `inquiry_id=eq.${inquiryId}` },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new as Message]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [inquiryId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("messages")
      .insert({ inquiry_id: inquiryId, sender_id: currentUserId, body: body.trim() });
    setSending(false);
    if (!error) setBody("");
  }

  return (
    <div className="mt-4 rounded-xl border border-line">
      <div className="max-h-72 space-y-2 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted">No messages yet — say hello.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
              m.sender_id === currentUserId
                ? "ml-auto bg-brand text-white"
                : "bg-surface text-ink"
            }`}
          >
            {m.body}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-line p-3">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a message…"
          className="h-9 flex-1 rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
        />
        <Button size="sm" onClick={send} disabled={sending || !body.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
