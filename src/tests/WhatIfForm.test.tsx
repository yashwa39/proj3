import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WhatIfForm } from "@/components/forms/WhatIfForm";

vi.mock("@/services/whatIfService", async () => {
  return {
    simulateWhatIf: vi.fn(async () => ({
      cat: "Energy",
      co2: "35.0 kg",
      cost: "₹2,400",
      be: "36 mo",
    })),
  };
});

describe("WhatIfForm", () => {
  it("disables submit until valid", async () => {
    render(<WhatIfForm />);
    const button = screen.getByRole("button", { name: /simulate/i });
    expect(button).toBeDisabled();

    await userEvent.type(
      screen.getByLabelText(/enter your what-if question/i),
      "What if I go solar?",
    );
    expect(button).toBeEnabled();
  });

  it("submits and shows result region", async () => {
    render(<WhatIfForm />);

    await userEvent.type(
      screen.getByLabelText(/enter your what-if question/i),
      "What if I install solar panels?",
    );
    const simulateButtons = screen.getAllByRole("button", { name: /^simulate$/i });
    const enabled = simulateButtons.find((b) => !b.hasAttribute("disabled"));
    expect(enabled).toBeTruthy();
    await userEvent.click(enabled!);

    await waitFor(() =>
      expect(screen.getByRole("region", { name: /simulation result/i })).toBeVisible(),
    );
    expect(screen.getByText("Simulation Complete")).toBeInTheDocument();
  });
});
