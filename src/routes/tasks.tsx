import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiTool, PageHeader, fieldCls } from "@/components/AiTool";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      { name: "description", content: "Prioritise tasks by urgency and importance and build daily or weekly schedules." },
      { property: "og:title", content: "AI Task Planner — AI Workplace Assistant" },
      { property: "og:description", content: "Urgency/importance prioritisation with daily or weekly plans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const [range, setRange] = useState("daily");
  const [hours, setHours] = useState("08:00–17:00");
  return (
    <>
      <PageHeader title="AI Task Planner" desc="List your tasks and get them prioritised into a schedule." />
      <AiTool
        task="tasks"
        cta="Plan my tasks"
        canSubmit={tasks.trim().length > 0}
        buildPrompt={() => `Schedule type: ${range}\nWorking hours: ${hours}\nTasks (with any known deadlines/notes):\n${tasks}`}
      >
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Schedule</span>
            <select className={fieldCls} value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Working hours</span>
            <input className={fieldCls} value={hours} onChange={(e) => setHours(e.target.value)} />
          </label>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">Tasks *</span>
          <textarea className={`${fieldCls} min-h-[240px]`} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"One task per line, e.g.\nPrepare Q3 report – due Friday\nReply to supplier emails"} />
        </label>
      </AiTool>
    </>
  );
}
