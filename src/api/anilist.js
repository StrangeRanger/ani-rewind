const ANILIST_ENDPOINT = 'https://graphql.anilist.co'

const REWATCH_QUERY = `
  query AnimeRewatches($userName: String!) {
    User(name: $userName) {
      id
      name
      siteUrl
    }
    MediaListCollection(userName: $userName, type: ANIME) {
      lists {
        entries {
          id
          repeat
          status
          updatedAt
          media {
            id
            siteUrl
            format
            episodes
            seasonYear
            title {
              romaji
              english
              native
            }
            coverImage {
              extraLarge
              large
              color
            }
          }
        }
      }
    }
  }
`

export function collectUniqueEntries(lists = []) {
  const entriesById = new Map()

  for (const list of lists) {
    for (const entry of list?.entries ?? []) {
      if (!entriesById.has(entry.id)) {
        entriesById.set(entry.id, entry)
      }
    }
  }

  return [...entriesById.values()]
}

export function getDisplayTitle(entry) {
  return (
    entry.media?.title?.english ||
    entry.media?.title?.romaji ||
    entry.media?.title?.native ||
    'Untitled anime'
  )
}

export function getRewatchSummary(entries = []) {
  const rewatchedEntries = []
  let totalRewatches = 0
  let topCount = 0

  for (const entry of entries) {
    const repeats = Number(entry.repeat) || 0
    if (repeats <= 0) continue

    rewatchedEntries.push(entry)
    totalRewatches += repeats
    topCount = Math.max(topCount, repeats)
  }

  return {
    entries: rewatchedEntries,
    totalRewatches,
    rewatchedTitles: rewatchedEntries.length,
    topCount,
  }
}

export async function fetchAnimeRewatches(userName, { signal } = {}) {
  const response = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: REWATCH_QUERY,
      variables: { userName },
    }),
    signal,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.errors?.length) {
    const apiMessage = payload?.errors?.[0]?.message

    if (response.status === 429) {
      throw new Error('AniList is receiving too many requests. Try again in a minute.')
    }

    if (response.status === 404 || apiMessage?.toLowerCase().includes('not found')) {
      throw new Error(`We couldn't find an AniList user named “${userName}”.`)
    }

    throw new Error(apiMessage || 'AniList could not be reached. Please try again.')
  }

  const lists = payload?.data?.MediaListCollection?.lists
  if (!lists) {
    throw new Error('This anime list is private or unavailable.')
  }

  const allEntries = collectUniqueEntries(lists)

  return {
    user: payload.data.User,
    ...getRewatchSummary(allEntries),
  }
}
