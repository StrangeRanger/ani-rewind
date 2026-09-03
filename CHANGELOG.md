# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-09-02

### Changed

- Migrated package management from npm to pnpm 11.25.0, including the lockfile,
  package metadata, and documented development commands.

### Fixed

- Updated ranking tick marks to show one filled tick per recorded rewatch, up to
  ten, instead of scaling every title relative to the user's highest rewatch count.

## [1.0.0] - 2026-09-02

### Added

- Introduced the AniRewind React application for looking up a public AniList user
  and ranking their most rewatched anime.
- Added direct AniList GraphQL integration that includes custom-list entries,
  deduplicates repeated list entries, and counts only positive rewatch totals.
- Added summary statistics for total rewatches, rewatched titles, and the highest
  individual rewatch count.
- Added sortable rankings by rewatch count, title, or last update, with cover art
  and links to matching AniList entries.
- Added responsive desktop and mobile layouts, light and dark themes, and loading,
  empty, and error states.
- Added local persistence for the most recently used username and theme.
- Added automated tests for entry deduplication and rewatch-total calculation.
