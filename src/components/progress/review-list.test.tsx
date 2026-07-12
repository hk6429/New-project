import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { pilotQuestions } from "@/data/questions/pilot";
import { loadProgress, saveProgress } from "@/infrastructure/progress/progress-store";
import { ReviewList } from "./review-list";

describe("ReviewList", () => {
  beforeEach(() => localStorage.clear());

  it("沒有錯題時提供開始挑戰入口", async () => {
    render(<ReviewList />);
    expect(await screen.findByRole("link", { name: "開始第一場挑戰" })).toHaveAttribute("href", "/play");
  });

  it("學生可重作錯題，答對後從復習清單移除", async () => {
    const question = pilotQuestions.find((item) => item.id === "Q001-C");
    expect(question).toBeDefined();
    saveProgress({ completedZones: [], experience: 0, mistakeIds: ["Q001-C"] });

    const user = userEvent.setup();
    render(<ReviewList />);

    await waitFor(() => expect(screen.getByRole("heading", { name: /何以解憂/ })).toHaveTextContent("何以解憂？唯有杜康。"));
    await user.click(screen.getByRole("button", { name: question!.correctAnswers[0] }));

    expect(screen.getByRole("status")).toHaveTextContent("已掌握");
    expect(loadProgress().mistakeIds).not.toContain(question!.id);
  });
});
