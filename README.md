# eleventy-tex

This plugin provides build-time rendering of LaTeX files, by adding templating
support for the `.tex` extension. Additionally, the `.md.tex` and `.texmd`
extensions are added to allow for a more author-friendly TeX format. Those files
are first processed by Liquid (similar to how Markdown does it), then TeX
expressions are processed, and the result is rendered by MarkDown. To configure
this behavior, see the options below.

## Installation

To install, run any of the following commands:

```bash
# For npm:
npx jsr add @vrugtehagel/eleventy-tex
# For yarn:
yarn dlx jsr add @vrugtehagel/eleventy-tex
# For pnpm:
pnpm dlx jsr add @vrugtehagel/eleventy-tex
# For deno:
deno add @vrugtehagel/eleventy-tex
```

## Config

Add the plugin like usual in your Eleventy configuration file (usually
`.eleventy.js`), optionally with an options argument:

```js
import EleventyTeX from "@vrugtehagel/eleventy-tex";

export default function (eleventyConfig) {
  // …
  eleventyConfig.addPlugin(EleventyTeX, {
    extension: "tex",
  });
  // …
}
```

There are a handful of options available:

- `extension`: The extension to process as TeX. Defaults to `"tex"`. Note that
  this is also used for the `.md.tex` and `.texmd` extensions; for example,
  when setting `extension: "latex"`, then the Markdown extensions become
  `.md.latex` and `.latexmd`.
- `texTemplateEngine`: Like Markdown files, TeX files are first processed by a
  templating engine to allow things like using `{{ data }}`. By default, this is
  set to `"liquid"`. Similar to Markdown, it may be set to any templating
  engine, or `false` to disable this preprocessing altogether.
- `delimiters`: An array of delimiters. By default, there are two inline
  delimiters, `\(…\)` and `$…$`, and two so-called "display" modes, `\[…\]` and
  `$$…$$`. It is possible to overwrite them, or import `defaultDelimiters` and
  use `[...defaultDelimiters, …]` to add them without removing the defaults.
- `katexOptions`: These options are passed as-is to KaTeX, which is the package
  used to render the math. See the [KaTeX docs](https://katex.org/docs/options)
  for more information, or check the types defined by this package. Note that
  these options may be overwritten by individual delimiters.
