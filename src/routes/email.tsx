import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiTool, PageHeader, fieldCls } from "@/components/AiTool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workly AI" },
      { name: "description", content: "Generate formal, informal or persuasive workplace emails for any audience." },
      { property: "og:title", content: "Smart Email Generator — Workly AI" },
      { property: "og:description", content: "AI-drafted workplace emails you can edit and copy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [tone, setTone] = useState("formal");
  const [audience, setAudience] = useState("client");
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  return (
    <>
      <PageHeader title="Smart Email Generator" desc="Describe what you need and choose a tone and audience." />
      <AiTool
        task="email"
        cta="Generate email"
        canSubmit={purpose.trim().length > 0}
        buildPrompt={() => `Tone: ${tone}\nAudience: ${audience}\nPurpose: ${purpose}\nKey points:\n${points || "None provided"}`}
      >
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Tone</span>
            <select className={fieldCls} value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="persuasive">Persuasive</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Audience</span>
            <select className={fieldCls} value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="client">Client</option>
              <option value="manager">Manager</option>
              <option value="team">Team</option>
            </select>
          </label>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Purpose of the email *</span>
          <input className={fieldCls} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Follow up on project proposal" />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Key points (optional)</span>
          <textarea className={`${fieldCls} min-h-[140px]`} value={points} onChange={(e) => setPoints(e.target.value)} placeholder="One point per line" />
        </label>
      </AiTool>
    </>
  );
}
