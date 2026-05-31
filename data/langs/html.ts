import { lang, section, card } from '../helpers';

export default lang({
  id: "html", name: "HTML", ext: ".html", year: 1993, common: true,
  sections: [
    section("basics", "basics", [
      card("structure + elements", {
        beginner: {
          explanation: "HTML is the skeleton of every webpage. It uses tags (words inside < >) to mark up text. Tags come in pairs — an opening tag and a closing tag with a / before the name. The browser reads your HTML and displays it as a webpage.",
          code: `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- head contains info about the page, not visible content -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>   <!-- shown in browser tab -->
</head>
<body>
    <!-- body contains everything visible on the page -->

    <h1>Main Heading</h1>       <!-- biggest heading -->
    <h2>Sub Heading</h2>        <!-- second biggest -->
    <p>This is a paragraph of text.</p>

    <strong>Bold text</strong>
    <em>Italic text</em>

    <!-- link — href is where it goes -->
    <a href="https://example.com">Click me</a>

    <!-- image — src is the file, alt is for accessibility -->
    <img src="photo.jpg" alt="A description of the photo">
</body>
</html>`,
          examples: [
            { input: `<p>Hello <strong>World</strong></p>`, output: `Hello World  (World is bold)` },
          ],
          note: "alt text on images is important — screen readers read it aloud for blind users, and it shows if the image fails to load. always write meaningful alt text",
        },
        intermediate: {
          explanation: "Semantic HTML uses tags that describe what the content IS, not just how it looks. This matters for accessibility (screen readers), SEO (search engines), and maintainability.",
          code: `<!-- semantic structure — describes the purpose of each section -->
<header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h1>Article Title</h1>
        <time datetime="2024-01-15">January 15, 2024</time>
        <p>Article content...</p>
    </article>

    <aside>
        <h2>Related Posts</h2>
        <!-- sidebar content -->
    </aside>
</main>

<footer>
    <p>&copy; 2024 My Site</p>
</footer>

<!-- data attributes — attach custom data to elements -->
<div data-user-id="123" data-role="admin">User</div>

<!-- ARIA — accessibility when semantic HTML isn't enough -->
<button aria-label="Close dialog" aria-expanded="false">X</button>`,
          examples: [
            { input: `<button onclick="alert('hi')">Click</button>`, output: `button that shows alert when clicked` },
          ],
          note: "use <button> for things you click to do something, <a> for navigation. don't use <div onclick> — it breaks keyboard navigation and screen readers",
        },
        advanced: {
          explanation: "Custom elements, shadow DOM, and Web Components let you create reusable HTML elements with encapsulated styles and behavior. Template literals and slots enable flexible composition.",
          code: `<!-- template — reusable HTML fragment, not rendered immediately -->
<template id="card-template">
    <div class="card">
        <slot name="title"></slot>   <!-- named slot -->
        <slot></slot>                <!-- default slot -->
    </div>
</template>

<!-- custom element usage (once defined in JS) -->
<my-card>
    <h2 slot="title">Card Title</h2>
    <p>Card content goes here</p>
</my-card>

<!-- define custom element in JavaScript -->
<script>
class MyCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.getElementById('card-template');
        shadow.appendChild(template.content.cloneNode(true));
    }
}
customElements.define('my-card', MyCard);
</script>

<!-- picture — serve different images for different screens -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>`,
          examples: [
            { input: `<details>\n  <summary>Click to expand</summary>\n  <p>Hidden content!</p>\n</details>`, output: `collapsible section, no JavaScript needed` },
          ],
          note: "shadow DOM creates an isolated DOM tree inside a custom element. styles inside shadow DOM don't leak out, and external styles don't leak in — true encapsulation",
        },
      }),

      card("forms", {
        beginner: {
          explanation: "Forms let users input data. Each input needs a name attribute (that's how the data is sent). Labels tell users what each field is for and clicking a label focuses its input — always connect them with for/id.",
          code: `<form action="/submit" method="post">

    <!-- label's for= must match input's id= -->
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" placeholder="Enter username">

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" minlength="8">

    <!-- dropdown -->
    <label for="country">Country:</label>
    <select id="country" name="country">
        <option value="">-- Select --</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
    </select>

    <!-- checkbox -->
    <input type="checkbox" id="agree" name="agree">
    <label for="agree">I agree to the terms</label>

    <button type="submit">Submit</button>
</form>`,
          examples: [
            { input: `<input type="email" required>`, output: `browser validates email format before submitting` },
          ],
          note: "type='email', type='number', type='date' etc do built-in browser validation and show appropriate keyboards on mobile. always use the most specific type",
        },
        intermediate: {
          explanation: "HTML5 form validation attributes let you validate without JavaScript. The Constraint Validation API lets you customize error messages. FormData API makes it easy to submit forms with JavaScript.",
          code: `<!-- built-in validation -->
<input type="text"
    required
    minlength="3"
    maxlength="20"
    pattern="[a-zA-Z0-9]+"
    title="Only letters and numbers allowed">

<input type="number" min="0" max="100" step="5">

<input type="url" placeholder="https://...">

<!-- fieldset groups related inputs -->
<fieldset>
    <legend>Shipping Address</legend>
    <label>Street: <input type="text" name="street"></label>
    <label>City:   <input type="text" name="city"></label>
</fieldset>

<!-- datalist — autocomplete suggestions -->
<input list="browsers" name="browser">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
</datalist>

<!-- JavaScript form handling -->
<script>
const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj  = Object.fromEntries(data);
    const res  = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' }
    });
});
</script>`,
          examples: [
            { input: `<input type="number" min="1" max="10" step="1">`, output: `spinner that only allows 1-10 in steps of 1` },
          ],
        },
        advanced: {
          explanation: "The File API, drag and drop, and custom form controls push what's possible without a framework. Custom validity lets you integrate server-side validation with native browser error UI.",
          code: `<!-- file upload with multiple files -->
<input type="file" id="upload" multiple accept=".jpg,.png,.pdf">

<script>
const input = document.getElementById('upload');
input.addEventListener('change', () => {
    for (const file of input.files) {
        console.log(file.name, file.size, file.type);
        // read file content
        const reader = new FileReader();
        reader.onload = (e) => console.log(e.target.result);
        reader.readAsText(file);  // or readAsDataURL for images
    }
});

// drag and drop
const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();  // must prevent default to allow drop
    dropzone.classList.add('drag-over');
});
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    processFiles(files);
});

// custom validation with server response
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', async () => {
    const res = await fetch(\`/check-email?email=\${emailInput.value}\`);
    const { taken } = await res.json();
    if (taken) {
        emailInput.setCustomValidity('This email is already taken');
        emailInput.reportValidity();
    } else {
        emailInput.setCustomValidity('');  // clear error
    }
});
</script>`,
          examples: [
            { input: `input.setCustomValidity("Email taken");\ninput.reportValidity();`, output: `shows native browser error UI with your custom message` },
          ],
          note: "setCustomValidity('') with empty string clears the custom error. you must call it to clear or the input will be stuck as invalid even if the user fixes the value",
        },
      }),
    ]),
  ],
});
