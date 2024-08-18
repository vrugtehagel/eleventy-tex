import { RenderPlugin } from "npm:@11ty/eleventy@^3.0.0-beta.1";
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

  async function processTeX(input: string): string {
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
      result += input.slice(lastCut, index);
      index += delimiter.start.length;
      let endIndex = index;
      do {
        endIndex = input.indexOf(delimiter.end, endIndex);
      } while (input[endIndex - 1] == "\\");
      if (endIndex == -1) {
        console.warn(`Found a ${delimiter.start} without ${delimiter.end}`);
        continue;
      }
      const math = input.slice(index, endIndex);
      const options = { ...katexOptions, ...delimiter.katexOptions };
      if (!options.displayMode && math.includes("\n")) {
        result += math;
      } else {
        result += katex.renderToString(math, options);
      }
      index = endIndex + delimiter.end.length;
      lastCut = index;
    }
    result += input.slice(lastCut);
    return result;
  }

  const ignore = new Set<string>();

  config.addPreprocessor("eleventy-tex-md", "md", (
    data: any,
    content: string,
  ): string | null => {
    ignore.add(data.inputPath);
    if (data.ignoreTeX || data.ignoreTex) return null;
    return processTeX(content);
  });

  config.addPreprocessor("eleventy-tex-md", [
    "*",
    "liquid",
    "njk",
  ], (data: any, content: string): string | null => {
    if (data.ignoreTeX || data.ignoreTex) ignore.add(data.page.inputPath);
    return null;
  });

  config.addTransform("tex", function (this: any, content: string): string {
    if (ignore.has(this.inputPath)) return content;
    return processTeX(content);
  });
}
