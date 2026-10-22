import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// AppShell reads the router for the active nav item and renders Link. Stub just
// those pieces so the shared layout can be rendered without the Start runtime.
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
const { PageHeader } = await import("@/components/AiTool");

// Wording is fixed by policy — assert the literal text so a reword fails here.
const FULL_DISCLAIMER =
  "Responsible AI: AI-generated content can be wrong and requires human review. " +
  "Don't enter confidential or sensitive workplace data unless this service is " +
  "approved for it by your organisation.";

function text(el: HTMLElement) {
  return el.textContent?.replace(/\s+/g, " ").trim();
}

describe("Responsible AI disclaimer", () => {
  it("is rendered once, in full, by the shared app layout", () => {
    render(
      <AppShell>
        <div data-testid="page" />
      </AppShell>,
    );

    const banners = screen.getAllByRole("note");
    expect(banners).toHaveLength(1);
    expect(text(banners[0]!)).toBe(FULL_DISCLAIMER);
  });

  it("is not repeated by the per-page header", () => {
    render(<PageHeader title="Smart Email Generator" desc="Describe what you need." />);

    expect(screen.queryByRole("note")).toBeNull();
    expect(document.body.textContent).not.toContain("Responsible AI");
  });
});
