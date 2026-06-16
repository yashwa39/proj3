import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { WhatIfForm } from "@/components/forms/WhatIfForm";

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
});
