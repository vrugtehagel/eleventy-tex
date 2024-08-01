import type { KaTeXOptions } from "./options.ts";

/** The default delimiters. Includes `\(…\)` and `$…$` for inline TeX, and
 * `\[…\]` and `$$…$$` for display math. Delimiters may be escaped outside of
 * these contexts, e.g. `\$5 to \$7 dollars` will not render a formula. */
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
