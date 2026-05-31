// ─────────────────────────────────────────────
//  devcheat — core types
//  everything flows from these
// ─────────────────────────────────────────────

export type Example = {
  input: string;   // code you run / expression
  output: string;  // what comes out
};

export type LevelContent = {
  explanation: string;  // plain english — what is this and why does it exist
  code: string;         // the actual code example
  examples?: Example[]; // input → output pairs
  note?: string;        // gotcha, tip, or extra context
};

export type Card = {
  title: string;
  beginner:     LevelContent;  // explain from scratch, no jargon
  intermediate: LevelContent;  // assumes programming knowledge
  advanced:     LevelContent;  // deep dive, edge cases, performance
};

export type Section = {
  id: string;     // used in URL / state, no spaces
  label: string;  // displayed in tabs
  cards: Card[];
};

export type Language = {
  id: string;       // unique, no spaces e.g. "cpp", "javascript"
  name: string;     // display name e.g. "C++", "JavaScript"
  ext: string;      // file extension e.g. ".cpp", ".js"
  year: number;     // year created
  common: boolean;  // true = always visible, false = behind "show more"
  sections: Section[];
};
