import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// AppShell and the dashboard both use Link / useRouterState. Stub those so the
// shared layout and the dashboard can be rendered without the Start runtime.
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...mod,
    useRouterState: () => "/",
    Link: ({
      children,
      to,
      ...rest
    }: { children?: ReactNode; to?: string } & Record<string, unknown>) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  };
});

const { AppShell } = await import("@/components/AppShell");
const { Route: IndexRoute } = await import("@/routes/index");

const Index = (IndexRoute as unknown as { options: { component: () => ReactNode } }).options
  .component;

function hrefsIn(container: HTMLElement) {
  return Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
}

function renderShell() {
  return render(
    <AppShell>
      <div data-testid="page" />
    </AppShell>,
  );
}

describe("Feature navigation", () => {
  it("offers only the three remaining tools", () => {
    const { container } = renderShell();

    const nav = container.querySelector("nav")!;
    expect(Array.from(nav.querySelectorAll("a")).map((a) => a.getAttribute("href"))).toEqual([
      "/",
      "/email",
      "/notes",
      "/tasks",
    ]);
    expect(container.textContent).not.toMatch(/research|ai chat/i);
  });

  it("never mentions CAPACITI", () => {
    const { container } = renderShell();

    expect(container.textContent).not.toMatch(/capaciti/i);
  });
});

describe("Dashboard", () => {
  it("counts the three available AI tools and links to nothing else", () => {
    const { container } = render(<Index />);

    expect(container.textContent).toContain("3 available");
    expect(container.textContent).not.toContain("5 available");
    expect(hrefsIn(container)).toEqual(
      expect.arrayContaining(["/email", "/notes", "/tasks"]),
    );
    expect(hrefsIn(container)).not.toContain("/research");
    expect(hrefsIn(container)).not.toContain("/chat");
  });
});
