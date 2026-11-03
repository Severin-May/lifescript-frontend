# LifeScript frontend

The editor for LifeScript, a small language for planning a week. You write a plan, see mistakes underlined
while you type, and get a schedule from the backend.

Built with React, Vite, Tailwind and the Monaco editor. The language, the API and the scheduler live in the
backend: see `../lifescript-backend/README.md`.

## Running it

Requires Node.js 22.12 or newer and the backend running on `http://localhost:8080`
(in `../lifescript-backend`: `./mvnw spring-boot:run`, or `mvnw.cmd` on Windows).

```
npm install
npm run dev       # http://localhost:5173; /api is proxied to the backend
```

| Script | Does |
|---|---|
| `npm run dev` | start the dev server |
| `npm test` | run the tests, rerunning on changes (`npx vitest run` runs them once) |
| `npm run lint` | check the code with ESLint |
| `npm run build` | build for production into `dist/` |

## What it does

- Highlights LifeScript and shows docs when you hover over a keyword.
- Checks the plan about 0.5 s after you stop typing (`/api/validate`): errors are underlined in the editor
  and listed below it; click one to jump to it.
- **Calendar** compiles the plan (`/api/compile`) and shows the schedule per day, with notes, warnings and
  tasks that couldn't be scheduled. Editing the plan greys the schedule out until you compile again.

Every request sends the browser's time zone, so "today" and "now" are the user's, not the server's.

## Layout

| Path | Contains |
|---|---|
| `src/App.jsx` | the page: live validation, compile results, the schedule panel |
| `src/api/lifescriptApi.js` | the calls to the backend |
| `src/components/Editor.jsx` | Monaco setup: highlighting, hover docs, error markers |
| `src/components/OutputPanel.jsx` | the list of errors under the editor |
| `src/components/ScheduleView.jsx` | the schedule as a list per day |
| `src/diagnostics.js` | turns backend diagnostics into editor markers |
