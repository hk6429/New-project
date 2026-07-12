import { classicBankQuestions } from "./bank-classics";
import { literacyQuestions } from "./bank-literacy";
import { modernQuestions } from "./bank-modern";
import { pilotQuestions } from "./pilot";

export const questionBank = [
  ...pilotQuestions,
  ...classicBankQuestions,
  ...modernQuestions,
  ...literacyQuestions,
];
