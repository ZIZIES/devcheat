// ─────────────────────────────────────────────
//  devcheat — helpers
//  makes adding a new language look like:
//
//  export default lang({
//    id: "rust", name: "Rust", ext: ".rs",
//    year: 2010, common: true,
//    sections: [
//      section("basics", "basics", [
//        card("variables", {
//          beginner:     { explanation: "...", code: `...` },
//          intermediate: { explanation: "...", code: `...` },
//          advanced:     { explanation: "...", code: `...` },
//        }),
//      ]),
//    ],
//  })
// ─────────────────────────────────────────────

import type { Language, Section, Card, LevelContent } from './types';

export function lang(def: Language): Language {
  return def;
}

export function section(id: string, label: string, cards: Card[]): Section {
  return { id, label, cards };
}

export function card(
  title: string,
  levels: {
    beginner:     LevelContent;
    intermediate: LevelContent;
    advanced:     LevelContent;
  }
): Card {
  return { title, ...levels };
}
