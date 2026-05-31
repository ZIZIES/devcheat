import { lang, section, card } from '../helpers';

export default lang({
  id: "css", name: "CSS", ext: ".css", year: 1996, common: true,
  sections: [
    section("basics", "basics", [
      card("selectors + properties", {
        beginner: {
          explanation: "CSS tells the browser how to style HTML elements. You write a selector (which elements to style) then a block of properties. Properties are key-value pairs separated by semicolons. CSS cascades — later rules override earlier ones.",
          code: `/* select by tag name */
p {
    color: navy;
    font-size: 16px;
    line-height: 1.5;
}

/* select by class (.classname) */
.button {
    background-color: blue;
    color: white;
    padding: 10px 20px;    /* top/bottom left/right */
    border-radius: 5px;    /* rounded corners */
    border: none;
    cursor: pointer;       /* hand cursor on hover */
}

/* select by id (#idname) — use sparingly */
#header {
    background: #333;
    color: white;
}

/* pseudo-class — special state */
.button:hover {
    background-color: darkblue;   /* when mouse is over it */
}
a:visited { color: purple; }
input:focus { outline: 2px solid blue; }`,
          examples: [
            { input: `p { color: red; font-size: 20px; }`, output: `all <p> elements become red and 20px` },
            { input: `.box { width: 100px; height: 100px; background: blue; }`, output: `blue square` },
          ],
          note: "ids (#) have higher specificity than classes (.) which have higher specificity than tags. when styles conflict, higher specificity wins. this is the 'cascade' in CSS",
        },
        intermediate: {
          explanation: "The box model describes how every element takes up space: content + padding (inside) + border + margin (outside). Box-sizing: border-box makes padding included in the width, which is almost always what you want.",
          code: `/* box-sizing: border-box — width includes padding and border */
* {
    box-sizing: border-box;  /* put this on everything */
}

.box {
    width: 300px;
    padding: 20px;       /* inside — space between content and border */
    border: 2px solid #333;
    margin: 10px;        /* outside — space between this and other elements */

    /* shorthand: top right bottom left (clockwise) */
    margin: 10px 20px 10px 20px;
    padding: 5px 10px;   /* top/bottom: 5px, left/right: 10px */
}

/* display — how an element behaves in layout */
span { display: inline; }       /* flows with text, no width/height */
div  { display: block; }        /* takes full width, starts new line */
img  { display: inline-block; } /* inline but can have width/height */

/* position */
.relative { position: relative; top: 10px; left: 20px; }  /* offset from normal */
.absolute { position: absolute; top: 0; right: 0; }       /* removed from flow, relative to parent */
.fixed    { position: fixed; bottom: 20px; right: 20px; } /* relative to viewport */
.sticky   { position: sticky; top: 0; }                   /* normal until scrolled to */`,
          examples: [
            { input: `/* without border-box: width=300 but total=344 */\n.box { width:300px; padding:20px; border:2px solid; }`, output: `total width is 344px (unexpected!)` },
            { input: `/* with border-box: width=300, total=300 */\n* { box-sizing: border-box; }\n.box { width:300px; padding:20px; border:2px solid; }`, output: `total width is exactly 300px` },
          ],
        },
        advanced: {
          explanation: "CSS custom properties (variables) let you define values once and reuse them. The :is(), :where(), and :has() pseudo-classes enable powerful selectors. Container queries style elements based on their parent's size, not the viewport.",
          code: `/* custom properties (CSS variables) */
:root {
    --color-primary: #6366f1;
    --color-bg:      #0a0a0a;
    --spacing-sm:    8px;
    --spacing-md:    16px;
    --radius:        8px;
}

.button {
    background: var(--color-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius);
}

/* override in a scope */
.dark-section {
    --color-primary: #818cf8;  /* different shade for dark bg */
}

/* :is() — match any in list (keeps specificity of most specific) */
:is(h1, h2, h3) { line-height: 1.2; }

/* :has() — style parent based on children */
.card:has(img) { padding: 0; }  /* card with image, remove padding */
label:has(input:required)::after { content: " *"; color: red; }

/* container queries — style based on parent size */
.card-grid { container-type: inline-size; }

@container (min-width: 400px) {
    .card { display: flex; }   /* only if grid is wide enough */
}`,
          examples: [
            { input: `:root { --size: 16px; }\n.big { --size: 24px; }\n/* elements inside .big use 24px */`, output: `variables cascade and can be overridden in any scope` },
          ],
          note: ":has() is sometimes called the 'parent selector' — it was the most-requested CSS feature for years. it's now widely supported. use it to style containers differently based on what they contain",
        },
      }),

      card("layout — flexbox + grid", {
        beginner: {
          explanation: "Flexbox arranges items in a row or column. CSS Grid arranges items in rows AND columns at the same time. Flexbox for 1D layouts (a navigation bar, a row of cards). Grid for 2D layouts (a full page layout).",
          code: `/* FLEXBOX — one dimensional layout */
.container {
    display: flex;
    flex-direction: row;          /* row (default) or column */
    justify-content: space-between; /* space items along main axis */
    align-items: center;          /* align items along cross axis */
    gap: 16px;                    /* space between items */
}

.container > * {
    flex: 1;   /* each child takes equal space */
}

/* GRID — two dimensional layout */
.grid {
    display: grid;
    grid-template-columns: 200px 1fr 1fr; /* 3 columns: fixed, flexible, flexible */
    grid-template-rows: auto 1fr auto;    /* 3 rows: auto, stretch, auto */
    gap: 16px;
}

/* repeat — shorthand for repeated columns */
.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */
    gap: 16px;
}`,
          examples: [
            { input: `.nav { display:flex; justify-content:space-between; align-items:center; }`, output: `items spread across nav, vertically centered` },
            { input: `.grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }`, output: `3-column grid with gaps` },
          ],
          note: "1fr means '1 fraction of the available space'. repeat(3, 1fr) makes 3 equal columns. repeat(auto-fill, minmax(200px, 1fr)) makes as many 200px+ columns as will fit — very useful for responsive card grids",
        },
        intermediate: {
          explanation: "Grid placement lets you control exactly where items go with grid-column and grid-row. Named areas make layouts extremely readable. Flexbox's flex-grow, flex-shrink, and flex-basis control how items resize.",
          code: `/* grid areas — name regions of the grid */
.layout {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main   main"
        "footer footer footer";
    grid-template-columns: 250px 1fr 1fr;
    grid-template-rows: 60px 1fr 50px;
    min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* flexbox fine-tuning */
.item {
    flex-grow:   1;   /* grow to fill extra space (0 = don't grow) */
    flex-shrink: 0;   /* don't shrink below flex-basis */
    flex-basis:  200px; /* starting size before growing/shrinking */
    /* shorthand: flex: grow shrink basis */
    flex: 1 0 200px;
}

/* responsive — auto-fill card grid */
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}`,
          examples: [
            { input: `.item { flex: 1; }  /* all items in flexbox get equal space */`, output: `items share remaining space equally` },
          ],
        },
        advanced: {
          explanation: "Subgrid lets nested elements align to the parent grid. Grid's implicit grid handles overflow items automatically. Masonry layout is finally coming to CSS.",
          code: `/* subgrid — nested items align to parent grid */
.parent {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}
.child {
    grid-column: span 2;  /* spans 2 parent columns */
    display: grid;
    grid-template-columns: subgrid;  /* aligns to parent's columns */
}

/* implicit grid — auto-creates rows/columns for overflow */
.gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 200px;  /* auto-created rows are 200px */
    grid-auto-flow: dense;  /* fills gaps with smaller items */
}

/* placing specific items */
.featured {
    grid-column: 1 / 3;  /* from line 1 to line 3 (spans 2 cols) */
    grid-row: 1 / 3;     /* from line 1 to line 3 (spans 2 rows) */
}

/* logical properties — work for RTL languages too */
.box {
    margin-inline: auto;       /* instead of margin-left/right: auto */
    padding-block: 1rem;       /* instead of padding-top/bottom: 1rem */
    border-inline-start: 3px solid blue;  /* instead of border-left */
}`,
          examples: [
            { input: `.featured { grid-column: 1/-1; }`, output: `spans ALL columns (1 to -1 = first to last)` },
          ],
          note: "logical properties (margin-inline, padding-block, border-inline-start) are direction-aware — they automatically flip for right-to-left languages like Arabic and Hebrew",
        },
      }),
    ]),
  ],
});
