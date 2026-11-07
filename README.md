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
| `npm test` | run the unit tests, rerunning on changes |
| `npm run test:contract` | run the contract tests once (needs the backend) |
| `npm run test:all` | run all tests once (needs the backend) |
| `npm run lint` | check the code with ESLint |
| `npm run build` | build for production into `dist/` |

## Tests

| Folder | Contains |
|---|---|
| `tests/unit/` | tests of single files, no backend needed; mirrors `src/` |
| `tests/contract/` | runs the frontend's code on real backend responses, so a change to the API format fails here; one file per API feature |
| `tests/support/` | shared test plans and backend setup |

The contract tests call the backend on `http://localhost:8080` directly and stop with a clear error if it isn't
running. Their plans use tomorrow's date, because a period can't start in the past.

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
| `src/api/` | the calls to the backend: `http.js` (CSRF header, errors), compiling, accounts, saved plans |
| `src/hooks/` | state and side effects kept out of components: login, the open plan, the plan list, Ctrl+S |
| `src/components/sidebar/` | the activity bar with the Explorer (saved plans) and the cheat sheet |
| `src/components/Editor.jsx` | the Monaco editor and its error markers |
| `src/components/OutputPanel.jsx` | the list of errors under the editor |
| `src/components/ScheduleView.jsx` | the schedule as a list per day |
| `src/components/Template*.jsx` | the template cards and menu |
| `src/language/` | LifeScript in the editor: keywords, highlighting, hover docs, auto-indent, snippets |
| `src/templates.js` | the starter plans |
| `src/diagnostics.js` | turns backend diagnostics into editor markers; builds the error shown when a request fails |
