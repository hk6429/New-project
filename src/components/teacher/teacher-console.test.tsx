import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  isSupabaseConfigured: () => true,
  getSupabaseBrowserClient: () => ({
    auth: { getUser: () => new Promise(() => undefined), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }) },
  }),
}));

import { TeacherConsole } from "./teacher-console";

describe("TeacherConsole", () => {
  it("登入前先說明三項控制臺價值", () => {
    render(<TeacherConsole />);
    expect(screen.getByRole("region", { name: "教師控制臺功能預覽" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("快速開課")).toBeInTheDocument();
    expect(screen.getByText("即時掌握")).toBeInTheDocument();
    expect(screen.getByText("安心複核")).toBeInTheDocument();
  });
});
