import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "../AuthForm";

describe("AuthForm", () => {
  it("submits register data when the email is within the stud.noroff.no domain", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <AuthForm mode="register" submitLabel="Register" onSubmit={onSubmit} />,
    );

    await user.type(screen.getByLabelText(/Name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^Email/i), "ada@stud.noroff.no");
    await user.type(screen.getByLabelText(/Password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ada Lovelace",
        email: "ada@stud.noroff.no",
        venueManager: false,
      }),
    );
  });

  it("prevents registration when using a non stud.noroff.no email", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <AuthForm mode="register" submitLabel="Register" onSubmit={onSubmit} />,
    );

    await user.type(screen.getByLabelText(/Name/i), "Grace Hopper");
    await user.type(screen.getByLabelText(/^Email/i), "grace@example.com");
    await user.type(screen.getByLabelText(/Password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /Register/i }));

    expect(
      await screen.findByText(/stud\.noroff\.no email address/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("forces manager registrations to opt into venue manager access", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <AuthForm
        mode="register"
        submitLabel="Create manager account"
        lockVenueManager
        showVenueManagerToggle={false}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText(/Name/i), "Mary Seacole");
    await user.type(screen.getByLabelText(/^Email/i), "mary@stud.noroff.no");
    await user.type(screen.getByLabelText(/Password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /Create manager/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ venueManager: true }),
    );
  });
});
