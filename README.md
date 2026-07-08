# Game Waitlist CRUD API

Game Waitlist CRUD API is a Node.js and Express REST API for managing game floor waitlist entries. It includes strict route parameter handling, standardized JSON responses, validation, text sanitization, simulated telemetry, and a lightweight accessible staff interface.

## Ticket

- Ticket ID: ENG-96576
- Epic: Core Infrastructure Overhaul
- Priority: P1
- Story Points: 5

## Features

- Express REST API with `GET`, `POST`, `PUT`, and `DELETE`.
- Route parameter support for `/api/waitlist/:id`.
- Standardized JSON payloads.
- Empty state handling with `No data found`.
- Validation errors for missing or malformed inputs.
- Text sanitization before storing state.
- Automatic game poster lookup from the game title using RAWG API when `RAWG_API_KEY` is available.
- Built-in poster matching for common games when RAWG is unavailable.
- Generated fallback covers when poster lookup is unavailable.
- Simulated analytics logs for create, update, and delete actions.
- Accessible staff interface with labels, ARIA messages, keyboard-friendly controls, and loading indicators.
- Clean monochromatic corporate design system.

## API Routes

```text
GET    /api/health
GET    /api/waitlist
GET    /api/waitlist/:id
POST   /api/waitlist
PUT    /api/waitlist/:id
DELETE /api/waitlist/:id
```

## Example Payload

```json
{
  "playerName": "Harman Singh",
  "gameTitle": "Tekken 8",
  "partySize": 2,
  "phone": "9876543210",
  "status": "waiting",
  "notes": "Prefers station near the counter."
}
```

## Standard Response

```json
{
  "success": true,
  "message": "Waitlist entries retrieved.",
  "data": [],
  "errors": null,
  "meta": {
    "count": 0
  }
}
```

## Run Locally

Create a `.env` file in the project root:

```env
PORT=3000
RAWG_API_KEY=your_rawg_api_key_here
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

For Windows PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

## Lint

```bash
npm run lint
```

## Deployment

This Express app can be deployed to Render, Railway, or any Node.js hosting provider.

Recommended start command:

```text
npm start
```

Environment variable:

```text
PORT=3000
RAWG_API_KEY=your_rawg_api_key_here
```

Most hosting providers set `PORT` automatically. Add `RAWG_API_KEY` manually in deployment settings if you want automatic poster lookup in production.

## Project Structure

```text
src/
  controllers/
  middleware/
  routes/
  services/
  utils/
  server.js
public/
  index.html
  styles.css
  app.js
```

## Demo Checklist

- Show the interface loading waitlist entries.
- Submit an invalid form and show red field errors.
- Add a valid waitlist entry.
- Edit an entry using `PUT /api/waitlist/:id`.
- Delete an entry using `DELETE /api/waitlist/:id`.
- Search for a missing player and show `No data found`.
- Show console analytics logs after primary actions.
