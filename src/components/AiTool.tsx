import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { runAi, type AiTask } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function Notice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">Responsible AI:</span> AI-generated content can be wrong and
        requires human review. Don't enter confidential or sensitive workplace data unless this service is approved
        for it by your organisation.
      </p>
    </div>
  );
}

export function PageHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6 space-y-4">
      <Notice />
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        <p className="mt-1 text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export const fieldCls =
  "w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function AiTool({
  task,
  buildPrompt,
  canSubmit,
  children,
  cta,
}: {
  task: AiTask;
  buildPrompt: () => string;
  canSubmit: boolean;
  children: ReactNode;
  cta: string;
}) {
  const run = useServerFn(runAi);
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setLoading(true);
    setError("");
    try {
      const r = await run({ data: { task, prompt: buildPrompt() } });
      if (r.ok) setOut(r.text);
      else setError(r.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        {children}
        <Button onClick={go} disabled={!canSubmit || loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating…" : cta}
        </Button>
        {error && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Output <span className="text-xs font-normal text-muted-foreground">(editable)</span></h2>
          <Button
            variant="outline"
            size="sm"
            disabled={!out}
            onClick={() => navigator.clipboard.writeText(out).then(() => toast.success("Copied to clipboard"))}
          >
            <Copy className="h-4 w-4" /> Copy
          </Button>
        </div>
        <Textarea
          value={out}
          onChange={(e) => setOut(e.target.value)}
          placeholder="Your AI result will appear here. Review and edit before using it."
          className="min-h-[360px] flex-1 bg-secondary font-mono text-sm"
        />
      </div>
    </div>
  );
}
