import { describe, expect, it } from "vitest";
import { createActivityCode } from "./activity-code";

describe("createActivityCode", () => {
  it("產生六位數活動代碼", () => {
    expect(createActivityCode(() => 0)).toBe("100000");
    expect(createActivityCode(() => 0.999999)).toBe("999999");
  });
});
