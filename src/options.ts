/** An options object. Every option is optional. */
export type EleventyTeXOptions = {
  /** These delimiters are used to find TeX inside the template. By default,
   * the delimiters `\(…\)` and `$…$` are used for inline math, and `\[…\]`
   * and `$$…$$` for display math. Note that, if you define your own, they
   * overwrite the defaults. To avoid this, import the `defaultDelimiters` and
   * use `delimiters: [...defaultDelimiters, …]` to keep them around.
   * To define custom delimiters, you must specify the `start` and `end` for
   * each delimiter as strings. Optionally, include some options to pass to
   * KaTeX (most notably `displayMode`) for TeX rendered with a specific custom
   * delimiter. Note that every delimiter may be escaped with a backslash; such
   * an occurrance is not used as a delimiter. The backslash is removed (but
   * only if it is followed by a registered delimiter!) */
  delimiters?: Array<{
    start: string;
    end: string;
    katexOptions?: KaTeXOptions;
  }>;

  /** Set default options to pass to KaTeX. These may be overwritten by
   * individual delimiters. */
  katexOptions?: KaTeXOptions;
};

/** An options object for parsing & rendering KaTeX. See the
 * [KaTeX docs](https://katex.org/docs/options) for more info. */
export type KaTeXOptions = {
  /** Whether or not to render in display mode. Defaults to `false`. */
  displayMode?: boolean;

  /** Defines the output language, defaults to `mathml`; this differs from the
   * default KaTeX has! */
  output?: "html" | "mathml" | "htmlAndMathml";

  /** Stands for "left equation numbers". Puts the label on the left when using
   * numbered equations. Off by default. */
  leqno?: boolean;

  /** "Flush left equations": renders display math left-aligned. */
  fleqn?: boolean;

  /** When parsing, throw instead of rendering an errored-out equation. Off by
   * default; note that this differs from the KaTeX default! */
  throwOnError?: boolean;

  /** A hex color (either three or six digits) to use when rendering an error.
   * Defaults to `#cc0000`. */
  errorColor?: string;

  /** A collection of custom macros. Note that this object can be modifier by
   * documents using e.g. `\gdef`. Does not come with macros by default. */
  macros?: Record<string, string>;

  /** A minimum thickness for "rules", e.g. the line in a fraction. */
  minRuleThickness?: number;

  /** Caps user-specified sizes. `Infinity` by default, meaning there is no
   * limit. */
  maxSize?: number;

  /** Limits the number of macro expansions to prevent infinite loops. Set to
   * `Infinity` if you dare. Defaults to `1000`. */
  maxExpand?: number;

  /** Defines what should throw errors. Defaults to "warn", meaning it tries to
   * help you conform to LaTeX-style TeX. */
  strict?: boolean | string | ((...args: unknown[]) => unknown);

  /** Whether or not to trust user input. `false` by default. */
  trust?: boolean | ((...args: unknown[]) => unknown);

  /** Run KaTeX code in the global group. `false` by default, to align with
   * LaTeX. */
  globalGroup?: boolean;
};
