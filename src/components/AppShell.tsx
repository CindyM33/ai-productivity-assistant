import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Mail, FileText, ListChecks, Menu, X, Sparkles } from "lucide-react";
import { ResponsibleAiBanner } from "@/components/ResponsibleAiBanner";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {open && <div className="fixed inset-0 z-30 bg-background/70 md:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-tight">AI Workplace</p>
            <p className="mt-1 text-xs text-muted-foreground">Productivity Assistant</p>
          </div>
          <button className="ml-auto md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"}`}
              >
                <n.icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl border border-sidebar-border p-4 text-xs text-muted-foreground">
          AI output needs human review.
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <ResponsibleAiBanner />
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-semibold truncate">AI Workplace Productivity Assistant</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
