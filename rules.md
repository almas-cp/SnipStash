# SnipStash - Rule Set

## Auto-Tagging Logic Rules

SnipStash uses pattern-based logic to automatically tag snippets based on code content. These rules help organize snippets without requiring manual tagging.

### Language Detection Rules
- JavaScript: Presence of `const`, `let`, `var`, `function`, `=>`, `.then()`, `async/await`
- Python: Presence of `def`, `import`, `class`, `if __name__ == "__main__":`
- Bash: Starts with `#!/bin/bash`, uses `$`, command-line utilities
- SQL: Contains `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `FROM`, `WHERE`
- HTML: Contains `<html>`, `<div>`, `<body>`, other HTML tags
- CSS: Contains selectors, `{`, `}`, properties like `margin`, `padding`

### Functionality-Based Tags

| Pattern | Tag | Description |
|---------|-----|-------------|
| `for`, `while`, `forEach`, `do...while` | `loop` | Code that performs iteration |
| `fetch`, `axios`, `XMLHttpRequest`, `http.get` | `api` | Code that makes API or network requests |
| `try`, `catch`, `throw`, `finally` | `error-handling` | Error handling mechanisms |
| `.map`, `.filter`, `.reduce`, `.forEach` | `array-ops` | Array operations |
| `console.log`, `print`, `echo`, `println` | `debugging` | Debugging statements |
| `function`, `def`, `=>`, `lambda` | `function` | Function definitions |
| `class`, `constructor`, `new`, `this` | `class` | Object-oriented patterns |
| `import`, `require`, `from` | `imports` | Import statements |
| `if`, `else`, `switch`, `case` | `conditionals` | Conditional logic |
| `JSON.parse`, `JSON.stringify` | `json` | JSON manipulation |
| `localStorage`, `sessionStorage` | `storage` | Client-side storage |
| `regex`, `match`, `test`, `/pattern/` | `regex` | Regular expressions |

## UI/UX Guidelines

### Snippet Display
- Show language badge using appropriate color coding
- Display the first 3-5 lines of code in preview mode
- Full view should have syntax highlighting based on language
- Tags should be visually distinct with appropriate colors

### Search and Filter
- Instant search as user types
- Filter by multiple tags simultaneously
- Filter by programming language
- Sort by date added, name, or frequency of use

## Data Structure

### Snippet Object
```javascript
{
  id: "unique-id",
  title: "Snippet title",
  code: "Actual code content",
  language: "javascript", // lowercase language identifier
  tags: ["array-ops", "loop"], // auto-generated + manual tags
  created: "2023-05-20T14:30:00Z",
  updated: "2023-05-20T14:30:00Z",
  user_id: "user-unique-id" // for authentication scoping
}
```

## Security Rules
- All snippets are private to the authenticated user
- Properly sanitize code input to prevent XSS attacks
- Rate limit API requests
- Implement proper authentication checks on all snippet operations

## Performance Considerations
- Cache frequently accessed snippets
- Implement pagination for large snippet collections
- Optimize search for performance
- Consider indexing on tags and language for faster filtering 