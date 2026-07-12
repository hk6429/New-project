import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { pilotQuestions } from "@/data/questions/pilot";
import { ContextQuiz } from "./context-quiz";

describe("ContextQuiz", () => {
  it("學生作答後看到借代線索、答案與解析", async () => {
    const user = userEvent.setup();
    const question = pilotQuestions.find((item) => item.id === "Q001-C");
    if (!question) throw new Error("missing fixture");

    render(<ContextQuiz questions={[question]} />);
    await user.click(screen.getByRole("button", { name: "酒" }));

    expect(screen.getByRole("status")).toHaveTextContent("答對了");
    expect(screen.getByText(/人物或專名代相關事物/)).toBeInTheDocument();
    expect(screen.getByText(/杜康相傳善於造酒/)).toBeInTheDocument();
  });
});

