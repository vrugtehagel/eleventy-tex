import type { KaTeXOptions } from "./options.ts";

export const defaultDelimiters: Array<{
  start: string;
  end: string;
  katexOptions?: KaTeXOptions;
}> = [
  { start: "\\[", end: "\\]", katexOptions: { displayMode: true } },
  { start: "\\(", end: "\\)" },
  { start: "$$", end: "$$", katexOptions: { displayMode: true } },
  { start: "$", end: "$" },
];
