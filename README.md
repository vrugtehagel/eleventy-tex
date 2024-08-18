# eleventy-tex

This plugin provides build-time rendering of LaTeX files. It introduces a
transform to scan for and replace any TeX syntax after your files have been
built, with the exception of Markdown files; for Markdown, the transform happens
_before_ the file is transformed to HTML. This is because things such as $a_1 +
a_2$ would first be transformed to $a&lt;em&g;1 + a&lt;em&gt;2$, which obviously
would break the MathML output. You may turn off the TeX processing on a per-page
basis by setting `ignoreTeX: true` in its front matter.

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

- `delimiters`: An array of delimiters. By default, there are two inline
  delimiters, `\(…\)` and `$…$`, and two so-called "display" modes, `\[…\]` and
  `$$…$$`. It is possible to overwrite them, or import `defaultDelimiters` and
  use `[...defaultDelimiters, …]` to add them without removing the defaults.
- `katexOptions`: These options are passed as-is to KaTeX, which is the package
  used to render the math. See the [KaTeX docs](https://katex.org/docs/options)
  for more information, or check the types defined by this package. Note that
  these options may be overwritten by individual delimiters.
