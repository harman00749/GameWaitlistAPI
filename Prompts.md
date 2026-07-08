# Game Waitlist CRUD API Prompt Log

## Assignment Summary

Build a Node.js/Express REST API for a Game Waitlist CRUD workflow using route parameters. The app must support standardized JSON responses, input validation, empty states, loading states, accessibility, telemetry simulation, and text sanitization.

## AI Debugging / Pair-Programming Sessions

### Session 1: Requirement Breakdown

Prompt:

```text
Explain what the Game Waitlist CRUD API with Route Parameters assignment requires and identify the backend routes needed.
```

Outcome:

- Confirmed the required tech stack is Node.js with Express.
- Mapped CRUD operations to REST routes.
- Identified route parameter usage through `/api/waitlist/:id`.
- Planned standardized JSON response shapes.

### Session 2: Edge Case Architecture

Prompt:

```text
How should an Express API handle empty states, invalid inputs, bad route parameters, and text sanitization for a waitlist system?
```

Outcome:

- Added validation for required fields, party size, phone format, and status values.
- Added `No data found` messaging for empty lists and search results.
- Added 404 handling for missing route parameter records.
- Added server-side sanitization before data is stored.

### Session 3: Interface and Accessibility

Prompt:

```text
Create an accessible staff interface for an Express CRUD API with loading indicators, field errors, keyboard-friendly controls, and a monochromatic design system.
```

Outcome:

- Added a static Express-served interface in `public/`.
- Added labels, ARIA live regions, keyboard navigable controls, and visual loading states.
- Added red invalid-field highlighting for validation errors.
- Added simulated analytics console logs after create, update, and delete actions.

### Session 4: Game Image Enhancement

Prompt:

```text
Can a game image appear when staff add a game name?
```

Outcome:

- Added generated game image cards without requiring external API keys.
- Mapped common game categories such as fighting, sports, racing, strategy, creative, and shooter.
- Kept the interface monochromatic and accessible with `role="img"` and ARIA labels.
- Added an optional game poster URL field so real poster images can display when staff provide a valid image link.

### Session 5: Automatic Poster Lookup

Prompt:

```text
Make it so I only type the game name and the original poster appears automatically when I add the entry.
```

Outcome:

- Added a backend poster lookup service that searches for game artwork from the submitted game title.
- Connected RAWG API through `RAWG_API_KEY` for broad game poster lookup.
- Added built-in poster matching for common game titles so posters can appear even when the external lookup is unavailable.
- Kept the poster lookup timeout short so slow connectivity does not block the CRUD workflow.
- Preserved fallback generated covers if poster lookup fails or if an image URL breaks.
- Kept manual poster URL support as an override.
