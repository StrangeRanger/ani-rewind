import { useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchAnimeRewatches,
  getDisplayTitle,
} from './api/anilist.js'
import { demoSummary } from './data/demo.js'

const SORT_OPTIONS = {
  count: 'Most rewatches',
  title: 'Title A–Z',
  updated: 'Recently updated',
}

function ArrowRightIcon({ size = 22 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 2.2v2M12 19.8v2M4.2 12h-2M21.8 12h-2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.2 15.2A8.4 8.4 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />
      <path d="M17.5 3.5v3M16 5h3" />
    </svg>
  )
}

function MenuIcon({ open }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  )
}

function LoopArtwork() {
  return (
    <svg className="loop-art" aria-hidden="true" viewBox="0 0 600 330">
      <path d="M585 190c-111 78-219 116-311 100-101-18-123-102-69-171 48-62 137-59 174-6 36 51 10 128-53 165" />
      <path className="loop-arrow" d="m237 246-57 39 64 23" />
    </svg>
  )
}

function StatIcon({ type }) {
  if (type === 'total') {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path d="M8.2 10.5A10.5 10.5 0 1 1 5.5 18" />
        <path d="m3.8 10.6 4.7-.7.7 4.7" />
      </svg>
    )
  }

  if (type === 'titles') {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path d="M9 4.5h14a2 2 0 0 1 2 2v21l-9-5.2L7 27.5v-21a2 2 0 0 1 2-2Z" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path d="m16 3 3.8 7.8 8.6 1.2-6.2 6 1.5 8.5-7.7-4-7.7 4 1.5-8.5-6.2-6 8.6-1.2L16 3Z" />
    </svg>
  )
}

function Header({ theme, onThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="AniRewind home">
        AniRewind
      </a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#rankings" onClick={() => setMenuOpen(false)}>Rankings</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
      </nav>
      <div className="header-actions">
        <button
          className="icon-button menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <MenuIcon open={menuOpen} />
        </button>
        <button
          className="icon-button theme-button"
          type="button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          onClick={onThemeToggle}
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}

function UsernameForm({ value, status, error, onChange, onSubmit }) {
  return (
    <form className="username-form" id="username-form" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="username">AniList username</label>
      <div className="input-shell">
        <span aria-hidden="true">@</span>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          spellCheck="false"
          maxLength="40"
          value={value}
          onChange={onChange}
          aria-describedby={error ? 'form-message' : undefined}
          aria-invalid={Boolean(error)}
        />
      </div>
      <button className="primary-button" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? <span className="spinner" aria-hidden="true" /> : null}
        {status === 'loading' ? 'Counting…' : 'Count my rewatches'}
      </button>
      <div className="form-message-wrap" aria-live="polite">
        {error ? <p className="form-message error" id="form-message">{error}</p> : null}
      </div>
    </form>
  )
}

function SummaryStrip({ summary }) {
  const stats = [
    { type: 'total', value: summary.totalRewatches, label: 'total rewatches' },
    { type: 'titles', value: summary.rewatchedTitles, label: 'rewatched titles' },
    { type: 'top', value: `${summary.topCount}×`, label: 'top count' },
  ]

  return (
    <section className="summary-strip" aria-label="Rewatch summary">
      {stats.map((stat) => (
        <div className="stat" key={stat.type}>
          <StatIcon type={stat.type} />
          <div>
            <strong>{Number.isInteger(stat.value) ? stat.value.toLocaleString() : stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

function Cover({ entry }) {
  const [imageFailed, setImageFailed] = useState(false)
  const source = entry.media?.coverImage?.extraLarge || entry.media?.coverImage?.large
  const accent = entry.media?.coverImage?.color || '#4d55e7'

  if (entry.spritePosition) {
    return (
      <span
        className="cover cover-sprite"
        style={{ backgroundPosition: entry.spritePosition }}
        aria-hidden="true"
      />
    )
  }

  if (!source || imageFailed) {
    return (
      <span className="cover cover-fallback" style={{ '--cover-accent': accent }} aria-hidden="true">
        <span>A</span>
      </span>
    )
  }

  return (
    <span className="cover">
      <img src={source} alt="" loading="lazy" onError={() => setImageFailed(true)} />
    </span>
  )
}

function RewatchBars({ count }) {
  const barCount = 10
  const filled = Math.min(Math.max(Math.trunc(count), 0), barCount)

  return (
    <span className="rewatch-bars" aria-hidden="true">
      {Array.from({ length: barCount }, (_, index) => (
        <span className={index < filled ? 'is-filled' : ''} key={index} />
      ))}
    </span>
  )
}

function RankingRow({ entry, index, selected, onSelect }) {
  const title = getDisplayTitle(entry)
  const countLabel = `${entry.repeat.toLocaleString()} ${entry.repeat === 1 ? 'rewatch' : 'rewatches'}`
  const Component = entry.media?.siteUrl ? 'a' : 'button'
  const linkProps = entry.media?.siteUrl
    ? { href: entry.media.siteUrl, target: '_blank', rel: 'noreferrer' }
    : { type: 'button' }

  return (
    <Component
      className={selected ? 'ranking-row is-selected' : 'ranking-row'}
      onFocus={onSelect}
      onMouseEnter={onSelect}
      onClick={onSelect}
      aria-label={entry.media?.siteUrl ? `${title}: ${countLabel}. Open on AniList.` : `${title}: ${countLabel}`}
      {...linkProps}
    >
      <span className="rank">{index + 1}.</span>
      <Cover entry={entry} />
      <span className="row-title">{title}</span>
      <RewatchBars count={entry.repeat} />
      <span className="row-count"><b>{entry.repeat.toLocaleString()}</b><span>{countLabel}</span></span>
      <span className="row-arrow"><ArrowRightIcon /></span>
    </Component>
  )
}

function EmptyState({ userName }) {
  return (
    <div className="empty-state">
      <span aria-hidden="true">↻</span>
      <h3>No rewatches saved yet</h3>
      <p>{userName}'s public anime list loaded, but every rewatch count is still zero.</p>
    </div>
  )
}

function Rankings({ summary, sort, onSort, status, activeUser }) {
  const [selectedId, setSelectedId] = useState(summary.entries[0]?.id)
  const sortedEntries = useMemo(() => {
    const entries = [...summary.entries]

    if (sort === 'title') {
      return entries.sort((a, b) => getDisplayTitle(a).localeCompare(getDisplayTitle(b)))
    }

    if (sort === 'updated') {
      return entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    }

    return entries.sort(
      (a, b) => b.repeat - a.repeat || getDisplayTitle(a).localeCompare(getDisplayTitle(b)),
    )
  }, [sort, summary.entries])

  useEffect(() => {
    setSelectedId(sortedEntries[0]?.id)
  }, [sortedEntries])

  return (
    <section className="rankings" id="rankings" aria-busy={status === 'loading'}>
      <div className="section-heading">
        <div>
          <h2>Most rewatched</h2>
          {activeUser ? <p>Showing @{activeUser}</p> : null}
        </div>
        <label className="sort-control">
          <span className="sr-only">Sort rankings</span>
          <select value={sort} onChange={onSort}>
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {sortedEntries.length ? (
        <div className="ranking-list">
          {sortedEntries.map((entry, index) => (
            <RankingRow
              entry={entry}
              index={index}
              selected={selectedId === entry.id}
              onSelect={() => setSelectedId(entry.id)}
              key={entry.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState userName={activeUser || 'This user'} />
      )}
    </section>
  )
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ani-rewind-theme') || 'light')
  const [username, setUsername] = useState(() => localStorage.getItem('ani-rewind-username') || 'mira')
  const [summary, setSummary] = useState(demoSummary)
  const [activeUser, setActiveUser] = useState('')
  const [sort, setSort] = useState('count')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const requestRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('ani-rewind-theme', theme)
  }, [theme])

  useEffect(() => () => requestRef.current?.abort(), [])

  async function handleSubmit(event) {
    event.preventDefault()
    const cleanUsername = username.trim().replace(/^@/, '')

    if (!cleanUsername) {
      setError('Enter your AniList username first.')
      return
    }

    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setStatus('loading')
    setError('')

    try {
      const result = await fetchAnimeRewatches(cleanUsername, { signal: controller.signal })
      setSummary(result)
      setActiveUser(result.user?.name || cleanUsername)
      setUsername(result.user?.name || cleanUsername)
      localStorage.setItem('ani-rewind-username', result.user?.name || cleanUsername)
      setStatus('success')
    } catch (requestError) {
      if (requestError.name === 'AbortError') return
      setError(requestError.message)
      setStatus('error')
    }
  }

  return (
    <div className="app-shell" id="top">
      <Header
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />
      <main>
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-content">
            <h1 id="page-title">Your comfort shows, ranked.</h1>
            <p>Enter your AniList username to see every rewatch add up.</p>
            <UsernameForm
              value={username}
              status={status}
              error={error}
              onChange={(event) => setUsername(event.target.value)}
              onSubmit={handleSubmit}
            />
          </div>
          <LoopArtwork />
        </section>
        <SummaryStrip summary={summary} />
        <Rankings
          summary={summary}
          sort={sort}
          onSort={(event) => setSort(event.target.value)}
          status={status}
          activeUser={activeUser}
        />
      </main>
      <footer id="about">
        <p>Counts use the rewatch total saved on your AniList entries.</p>
        <p>Public lists only · Your username stays in this browser</p>
      </footer>
    </div>
  )
}

export default App
