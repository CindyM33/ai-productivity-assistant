import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiTool, PageHeader, fieldCls } from "@/components/AiTool";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { name: "description", content: "Summarise meeting notes into decisions, action items, owners and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { property: "og:description", content: "Turn raw meeting notes into clear, reviewable summaries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  return (
    <>
      <PageHeader title="Meeting Notes Summarizer" desc="Paste your notes to get a summary, decisions, action items, owners and deadlines." />
      <AiTool task="notes" cta="Summarise notes" canSubmit={notes.trim().length > 20} buildPrompt={() => notes}>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Meeting notes *</span>
          <textarea className={`${fieldCls} min-h-[320px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste raw meeting notes or a transcript…" />
        </label>
        <p className="text-xs text-muted-foreground">Owners and deadlines are only listed if they appear in your notes.</p>
      </AiTool>
    </>
  );
}
