# AniRewind

[![Project Tracker](https://img.shields.io/badge/repo%20status-Project%20Tracker-lightgrey)](https://hthompson.dev/project-tracker#project-1356542676)

AniRewind reads the public anime list for an AniList username, totals the `repeat` value saved on every unique entry, and ranks the user's most rewatched shows.

## AI disclosure

This project was created using ChatGPT. ChatGPT generated the application code,
interface, tests, documentation, and project configuration in response to guidance
from the repository owner.

This disclosure is intentional: the project should not be presented or understood
as work authored solely by the repository owner. Transparency about the role of AI
in its creation is an explicit part of the project.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open the local URL printed by Vite.

## How counting works

- The browser sends one public GraphQL request directly to `https://graphql.anilist.co`.
- `MediaListCollection` is used so entries hidden from default status lists but present in custom lists are included.
- Entries are deduplicated by AniList list-entry ID before counting, since an entry can appear in more than one returned group.
- Only positive `MediaList.repeat` values are ranked and summed. AniList defines this field as the number of times the media has been rewatched.
- Private lists require AniList authentication and are not accessible in this username-only version.

No username or list data is sent anywhere other than AniList. The most recently used username and theme are saved in local browser storage.

## Commands

```bash
pnpm test
pnpm build
pnpm preview
```

The visual concepts used for implementation are stored in [`design/`](./design/).
