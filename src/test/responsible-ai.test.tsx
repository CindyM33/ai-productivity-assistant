import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { RESPONSIBLE_AI_TEXT } from "@/components/ResponsibleAiBanner";

const FULL_DISCLAIMER = `Responsible AI: ${RESPONSIBLE_AI_TEXT}`;

// The disclaimer is policy: it must stay on every page, word for word, exactly once.
describe("Responsible AI disclaimer", () => {
  const pages = ["/", "/email", "/notes", "/tasks"] as const;

  for (const path of pages) {
    it(`shows the full disclaimer once on ${path}`, async () => {
      const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
      render(<RouterProvider router={router} />);
      await router.navigate({ to: path });
      await waitFor(() => expect(screen.getByRole("note")).toBeInTheDocument());

      const banners = screen.getAllByRole("note");
      expect(banners).toHaveLength(1);
      expect(banners[0]!.textContent?.replace(/\s+/g, " ").trim()).toBe(FULL_DISCLAIMER);
    });
  }
});
