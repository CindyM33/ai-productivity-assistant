import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, ArrowRight, ShieldCheck, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      { name: "description", content: "Draft emails, summarise meetings and plan tasks with an AI workplace assistant." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Your AI workplace assistant for emails, meeting notes and task planning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const stats = [
  { icon: Sparkles, label: "AI tools", value: "3 available" },
  { icon: Pencil, label: "Outputs", value: "Editable & copyable" },
  { icon: ShieldCheck, label: "Review", value: "Human in the loop" },
];

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft formal, informal or persuasive emails for clients, managers or your team." },
  { to: "/notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn raw notes into a summary, decisions, action items, owners and deadlines." },
  { to: "/tasks", icon: ListChecks, title: "AI Task Planner", desc: "Prioritise by urgency and importance, then get a daily or weekly schedule." },
] as const;

function Index() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-hero p-8 shadow-glow md:p-12">
        <p className="text-sm font-medium text-primary-foreground/80">AI Workplace Productivity Assistant</p>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold text-primary-foreground md:text-5xl">
          Your AI workplace assistant
        </h1>
        <p className="mt-4 max-w-lg text-primary-foreground/85">
          Write emails, summarise meetings and plan your work in one place — then review and refine every result.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link to="/email"><Mail className="h-4 w-4" /> Start with Email</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <Link to="/tasks"><ListChecks className="h-4 w-4" /> Plan my tasks</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Productivity Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gradient">
                <t.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
