import { describe, expect, it } from "vitest";
import { ApiError, extractErrorMessages } from "@/lib/api";
import { getErrorMessage } from "@/helpers/errorMessageHelper";

describe("extractErrorMessages", () => {
  it("extracts messages from an errors array with paths", () => {
    const payload = {
      statusCode: 400,
      errors: [
        {
          message: "Name can only use a-Z, 0-9, and _",
          path: ["name"],
        },
        {
          message: "Email must be valid",
          path: ["email"],
        },
      ],
    };

    expect(extractErrorMessages(payload)).toEqual([
      "Name can only use a-Z, 0-9, and _",
      "email: Email must be valid",
    ]);
  });

  it("extracts messages from keyed error dictionaries", () => {
    const payload = {
      errors: {
        email: ["Email is required", "Email must contain @ symbol"],
        password: "Password is too short",
      },
    };

    expect(extractErrorMessages(payload)).toEqual([
      "email: Email is required",
      "email: Email must contain @ symbol",
      "password: Password is too short",
    ]);
  });
});

describe("getErrorMessage", () => {
  it("prefers API-provided messages over generic error text", () => {
    const payload = {
      errors: [
        { message: "Name can only use a-Z, 0-9, and _", path: ["name"] },
      ],
    };
    const err = new ApiError(
      "Request failed with status code 400",
      400,
      undefined,
      payload,
    );

    expect(getErrorMessage(err)).toBe(
      "name: Name can only use a-Z, 0-9, and _",
    );
  });
});
