import { RenderPlugin } from "npm:@11ty/eleventy@^3.0.0-alpha.18";
import katex from "npm:katex@^0.16.11";

import type { EleventyTeXOptions } from "./options.ts";
import { defaultDelimiters } from "./default-delimiters.ts";

/** The type for the eleventyConfig argument provided to plugins. Eleventy does
 * not expose its real type (yet), so `any` will do. */
type EleventyConfig = any;

export function EleventyTeX(
  config: EleventyConfig,
  options: EleventyTeXOptions = {},
) {
  /** Prepare defaults */
  const {
    extension = "tex",
    texTemplateEngine = "liquid",
    delimiters = defaultDelimiters,
    katexOptions = {},
  } = options;

  /** The defaults that differ from KaTeX's defaults. */
  katexOptions.throwOnError ??= false;
  katexOptions.output ??= "mathml";

  async function compile(
    content: string,
  ): Promise<(data: any) => Promise<string>> {
    const render: (content: string) => Promise<string> = texTemplateEngine
      ? await RenderPlugin.String(content, texTemplateEngine)
      : (content: string) => Promise.resolve(content);
    return async (data: any): Promise<string> => {
      const input = await render(data);
      console.log(input);
      let result = "";
      let lastCut = 0;
      for (let index = 0; index < input.length; index++) {
        const delimiter = delimiters.find((delimiter) => {
          return input.startsWith(delimiter.start, index);
        });
        if (!delimiter) continue;
        console.log(delimiter, index);
        if (input[index - 1] == "\\") {
          result += input.slice(lastCut, index - 1);
          lastCut = index;
          index += delimiter.start.length - 1;
          continue;
        }
        result += input.slice(lastCut, index);
        console.log("adding:", input.slice(lastCut, index));
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
        result += katex.renderToString(math, {
          ...katexOptions,
          ...delimiter.katexOptions,
        });
        index = endIndex + delimiter.end.length;
        lastCut = index;
      }
      console.log("adding", input.slice(lastCut));
      result += input.slice(lastCut);
      return result;
    };
  }

  config.addTemplateFormats(extension);
  config.addExtension(extension, { compile });
}
