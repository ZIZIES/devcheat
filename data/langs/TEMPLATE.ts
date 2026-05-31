// ─────────────────────────────────────────────
//  HOW TO ADD A NEW LANGUAGE
//
//  1. copy this file to data/langs/yourlang.ts
//  2. fill in the blanks
//  3. import it in data/languages.ts and add to the array
//  4. add an icon in pages/index.tsx LANG_ICONS
//  done!
// ─────────────────────────────────────────────

import { lang, section, card } from '../helpers';

export default lang({
  id: "yourlang",        // unique id, no spaces, lowercase
  name: "Your Language", // display name
  ext: ".ext",           // file extension
  year: 2000,            // year the language was created
  common: true,          // true = always shown, false = behind "show more"

  sections: [

    section("basics", "basics", [

      card("hello world", {
        beginner: {
          explanation: "Explain what this is in plain english. No jargon. Pretend you're explaining to someone who knows what a computer is but has never coded.",
          code: `// your code here
print("Hello, World!")`,
          examples: [
            { input: "the command to run it", output: "Hello, World!" },
          ],
          note: "optional tip or gotcha the beginner should know",
        },

        intermediate: {
          explanation: "Explain assuming they already know at least one programming language. Focus on what's different or interesting about THIS language.",
          code: `// intermediate code example
// more detail, real patterns`,
          examples: [
            { input: "some expression", output: "the result" },
          ],
          note: "optional — a gotcha or performance note",
        },

        advanced: {
          explanation: "Go deep — internals, edge cases, performance. Still explain what things ARE, just don't hold back on complexity. No random jargon without explanation.",
          code: `// advanced code
// edge cases, internals, real-world patterns`,
          examples: [
            { input: "edge case", output: "surprising result" },
          ],
          note: "optional — something that trips up experienced devs",
        },
      }),

      // add more cards here...
      // card("variables", { beginner: {...}, intermediate: {...}, advanced: {...} }),

    ]),

    // add more sections here...
    // section("functions", "functions", [ card(...), card(...) ]),

  ],
});
