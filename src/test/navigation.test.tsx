import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// AppShell and the dashboard both use Link / useRouterState. Stub those so the
// shared layout and the dashboard can be rendered without the Start runtime.
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...mod,
    useRouterState: () => "/",
    Link: ({ children, ...rest }: { children?: ReactNode } & Record<string, unknown>) => {
      const { to: _to, ...anchorProps } = rest as { to?: string } & Record<string, unknown>;
      return <a {...anchorProps}>{children}</a>;
    },
  };
});

const { AppShell } = await import("@/components/AppShell");
const { Route: IndexRoute } = await import("@/routes/index");

function navHrefs() {
  const nav = screen.getByRole("navigation");
  return Array.from(nav.querySelectorAll("a")).map((a) => a.getAttribute("href"));
}

describe("Feature navigation", () => {
  it("offers only the three remaining tools", () => {
    render(
      <AppShell>
        <div data-testid="page" />
      </AppShell>,
    );

    expect(navHrefs()).toEqual(["/", "/email", "/notes", "/tasks"]);
    expect(document.body.textContent).not.toMatch(/research|ai chat/i);
  });

  it("never mentions CAPACITI", () => {
    render(
      <AppShell>
        <div data-testid="page" />
      </AppShell>,
    );

    expect(document.body.textContent).not.toMatch(/capaciti/i);
  });
});

describe("Dashboard", () => {
  it("counts the three available AI tools and links to nothing else", () => {
    const Index = (IndexRoute as unknown as { options: { component: () => ReactNode } }).options
      .component;
    render(<Index />);

    expect(screen.getByText("3 available")).toBeTruthy();
    expect(screen.queryByText("5 available")).toBeNull();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/email");
    expect(hrefs).toContain("/notes");
    expect(hrefs).toContain("/tasks");
    expect(hrefs).not.toContain("/research");
    expect(hrefs).not.toContain("/chat");
  });
});
