# AniRewind

[![Project Tracker](https://img.shields.io/badge/repo%20status-Project%20Tracker-lightgrey)](https://hthompson.dev/project-tracker#project-1356542676)

AniRewind shows which anime you return to most. Enter an AniList username to see a ranked list of rewatched shows, your total rewatches, the number of titles you've rewatched, and your highest rewatch count.

## Using AniRewind

1. Enter a username with a public AniList anime list and select **Count my rewatches**.
2. Browse the results, sorting by most rewatches, title, or most recently updated list entry.
3. Select a show to open its AniList page, or select the username above the rankings to open the user's profile.

The page displays sample rankings until you look up a username. Light and dark themes are available from the header.

## Understanding the counts

Counts come from the rewatch totals saved on AniList entries. Only titles with a positive rewatch count appear in the results; the original watch is not included in the total.

AniRewind reads entries from both standard and custom lists, counting each list entry once even if it belongs to multiple groups. The totals reflect what is recorded on AniList, so rewatches that haven't been logged there won't appear.

Only public anime lists are supported. AniRewind does not offer AniList sign-in or access to private lists.

## Data and privacy

Anime list lookups are sent directly from your browser to the AniList GraphQL API. Your most recently used username and theme preference are saved in local browser storage.

Production builds load [the shared Matomo analytics script](https://files.hthompson.dev/scripts/tracking.js) for page views and outbound link clicks, with cookies shared across `*.hthompson.dev`. Analytics runs in local production previews (`pnpm preview`) as well as deployed builds; it is disabled in the development server (`pnpm dev`).

## Local development

AniRewind is a React application built with Vite. Install Node.js and the pnpm version specified in [`package.json`](./package.json), then run:

```bash
pnpm install
pnpm dev
```

Then open the local URL printed by Vite.

### Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server. |
| `pnpm test` | Run the automated tests. |
| `pnpm build` | Build the production site into `dist/`. |
| `pnpm preview` | Serve the production build locally after running `pnpm build`. |

## AI disclosure

This project was created using ChatGPT. ChatGPT generated the application code,
interface, tests, documentation, and project configuration in response to guidance
from the repository owner. The project is not solely authored by the repository owner.
