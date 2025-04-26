SnipStash – Code Snippet Organizer + Smart Categorizer
🧠 Scenario:
Developers constantly copy snippets from StackOverflow, blog posts, or projects — but rarely organize them. They paste them into sticky notes, Notion, random VS Code files, or worse… forget them entirely.

SnipStash is a smart snippet organizer where devs can quickly save, categorize, tag, and search code snippets across languages — and the app uses logic to auto-tag snippets based on their content (no AI needed, just pattern logic).

🎯 Objective:
Build a fullstack web app where users can:

Save reusable code snippets in various languages
Auto-categorize snippets by language or intent (loop, fetch, error handler)
Manually tag and group snippets
Search and filter snippets by tag, language, or usage
Quickly copy or insert into clipboard
👤 User Role: user
One role — authenticated users manage their own private snippet vault.

🔐 Authentication & Authorization:
Secure login/signup via email
All snippets and categories are scoped to the logged-in user
No public sharing required for MVP
🔧 Core Functional Features:
1. Save a Snippet
Form with:

Snippet title
Code input (multi-line textarea with syntax highlighting)
Select language (dropdown: JS, Python, Bash, etc.)
Optional: manual tags or description
"Smart Categorize" runs on submit to generate default tags
2. Auto-Tagging Logic
On submit, run rule-based parsing to identify:

for / while → tag: loop
fetch / axios / XMLHttpRequest → tag: API
try / catch → tag: error handling
.map / .filter() → tag: array ops
console.log → tag: debugging
Etc.

You can store this as a simple tag list per snippet. Tags are editable later.

3. My Snippet Library
Display all saved snippets
Filter by:
Language
Tag
Keyword in title or body
Show:
Title
First few lines
Language badge
Tags
"Copy