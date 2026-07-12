import { describe, expect, it } from "vitest";
import { normalizeActivityCode, normalizeNickname } from "./join-input";

describe("classroom join input", () => {
  it("只保留六位數活動碼", () => {
    expect(normalizeActivityCode(" 48-27 31 ")).toBe("482731");
    expect(normalizeActivityCode("1234567")).toBe("123456");
  });

  it("整理暱稱並限制長度", () => {
    expect(normalizeNickname("  小明  同學 ")).toBe("小明 同學");
    expect(normalizeNickname("一二三四五六七八九十甲乙丙丁戊己庚辛壬癸")).toHaveLength(16);
  });
});
