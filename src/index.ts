import katex from "npm:katex@^0.16.11";

import type { EleventyTeXOptions } from "./options.ts";
import { defaultDelimiters } from "./default-delimiters.ts";

/** The type for the eleventyConfig argument provided to plugins. Eleventy does
 * not expose its real type (yet), so `any` will do. */
type EleventyConfig = any;

/** The plugin, to add with `eleventyConfig.addPlugin(…)`, with an optional
 * second argument to configure the plugin as described in the
 * `EleventyTeXOptions` type. */
export function EleventyTeX(
  config: EleventyConfig,
  options: EleventyTeXOptions = {},
) {
  /** Prepare defaults */
  const {
    delimiters = defaultDelimiters,
    katexOptions = {},
  } = options;

  /** The defaults that differ from KaTeX's defaults. */
  katexOptions.throwOnError ??= false;
  katexOptions.output ??= "mathml";

  function processTeX(input: string): string {
    let result = "";
    let lastCut = 0;
    for (let index = 0; index < input.length; index++) {
      const delimiter = delimiters.find((delimiter) => {
        return input.startsWith(delimiter.start, index);
      });
      if (!delimiter) continue;
      if (input[index - 1] == "\\") {
        result += input.slice(lastCut, index - 1);
        lastCut = index;
        index += delimiter.start.length - 1;
        continue;
      }
      const options = { ...katexOptions, ...delimiter.katexOptions };
      index += delimiter.start.length;
      let endIndex = index;
      if (options.displayMode) {
        do {
          endIndex = input.indexOf(delimiter.end, endIndex);
        } while (input[endIndex - 1] == "\\");
        if (endIndex == -1) {
          result += input.slice(lastCut, index);
          lastCut = index;
          continue;
        }
      } else {
        const newlineIndex = input.indexOf("\n", index);
        do {
          endIndex = input.indexOf(delimiter.end, endIndex);
        } while (input[endIndex - 1] == "\\" && endIndex < newlineIndex);
        if (endIndex >= newlineIndex || endIndex == -1) {
          result += input.slice(lastCut, index);
          lastCut = index;
          continue;
        }
      }
      result += input.slice(lastCut, index - delimiter.start.length);
      const math = input.slice(index, endIndex);
      result += katex.renderToString(math, options);
      index = endIndex + delimiter.end.length;
      lastCut = index;
    }
    result += input.slice(lastCut);
    return result;
  }

  const ignored = new Set<string>();

  config.addPreprocessor("eleventy-tex-md", [
    "*",
    "md",
    "liquid",
    "njk",
  ], (
    data: any,
    content: string,
  ): string | null => {
    const ignore = data.ignoreTeX || data.ignoreTex;
    const path = data.page.inputPath;
    if (!ignore && !path.endsWith(".md")) return null;
    ignored.add(data.page.inputPath);
    if (ignore) return null;
    return processTeX(content);
  });

  config.addTransform("tex", function (this: any, content: string): string {
    if (ignored.has(this.inputPath)) return content;
    return processTeX(content);
  });
}
