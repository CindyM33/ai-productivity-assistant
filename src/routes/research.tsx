import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiTool, PageHeader, fieldCls } from "@/components/AiTool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Workly AI" },
      { name: "description", content: "Get a balanced AI overview of a workplace topic, with points to verify." },
      { property: "og:title", content: "Research Assistant — Workly AI" },
      { property: "og:description", content: "Quick topic overviews with verification prompts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  return (
    <>
      <PageHeader title="Research" desc="Get a quick overview of a topic. Always verify facts with reliable sources." />
      <AiTool task="research" cta="Research topic" canSubmit={topic.trim().length > 2} buildPrompt={() => topic}>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Topic or question *</span>
          <textarea className={`${fieldCls} min-h-[200px]`} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Best practices for running effective remote stand-ups" />
        </label>
      </AiTool>
    </>
  );
}
