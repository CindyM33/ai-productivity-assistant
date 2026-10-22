import { ShieldAlert } from "lucide-react";

/**
 * App-wide Responsible AI disclaimer.
 *
 * Rendered once by AppShell so it stays visible on every page — including the
 * Email Generator, Notes Summarizer and Task Planner. The wording is fixed by
 * policy: do not rephrase, shorten or remove it.
 */
export const RESPONSIBLE_AI_LEAD = "Responsible AI:";

export const RESPONSIBLE_AI_TEXT =
  "AI-generated content can be wrong and requires human review. Don't enter confidential or sensitive workplace data unless this service is approved for it by your organisation.";

export function ResponsibleAiBanner() {
  return (
    <div
      role="note"
      className="sticky top-0 z-20 flex items-start gap-2.5 border-b border-warning/30 bg-warning/10 px-4 py-2 backdrop-blur md:px-8"
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-foreground">
        <span className="font-semibold text-warning">{RESPONSIBLE_AI_LEAD}</span>{" "}
        {RESPONSIBLE_AI_TEXT}
      </p>
    </div>
  );
}
