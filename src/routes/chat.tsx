import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { runAi } from "@/lib/ai.functions";
import { PageHeader, fieldCls } from "@/components/AiTool";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — AI Workplace Assistant" },
      { name: "description", content: "Chat with the AI Workplace Assistant about everyday workplace questions." },
      { property: "og:title", content: "AI Chat — AI Workplace Assistant" },
      { property: "og:description", content: "A workplace AI chat assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const run = useServerFn(runAi);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const history = msgs;
    setMsgs([...history, { role: "user", content: text }]);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const r = await run({ data: { task: "chat", prompt: text, history } });
      if (r.ok) setMsgs((m) => [...m, { role: "assistant", content: r.text }]);
      else {
        setError(r.error);
        setInput(text);
        setMsgs(history);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
      setInput(text);
      setMsgs(history);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="AI Chat" desc="Ask workplace questions. Review answers before acting on them." />
      <div className="flex min-h-[480px] flex-col rounded-2xl border border-border bg-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.length === 0 && <p className="text-sm text-muted-foreground">Start the conversation below.</p>}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                {m.content}
                {m.role === "assistant" && (
                  <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => navigator.clipboard.writeText(m.content).then(() => toast.success("Copied"))}>
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
        {error && <p className="mx-5 mb-3 rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
        <form className="flex gap-2 border-t border-border p-4" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input className={fieldCls} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message…" />
          <Button type="submit" disabled={loading || !input.trim()}><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </>
  );
}
