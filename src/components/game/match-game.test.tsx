import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { pilotQuestions } from "@/data/questions/pilot";
import { MatchGame } from "./match-game";

describe("MatchGame", () => {
  it("學生配對成功後得到明確文字回饋與解析", async () => {
    const user = userEvent.setup();
    render(<MatchGame questions={[pilotQuestions[0]]} />);

    await user.click(screen.getByRole("button", { name: "借代詞：杜康" }));
    await user.click(screen.getByRole("button", { name: "實際所指：酒" }));

    expect(screen.getByRole("status")).toHaveTextContent("配對成功");
    expect(screen.getByText(/杜康相傳善於造酒/)).toBeInTheDocument();
  });
});

