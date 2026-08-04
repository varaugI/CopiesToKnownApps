import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { catalog as fallbackCatalog, categories, filterTitles, formatClock, formatDuration, toggleInCollection, type Title } from './store';

type View = 'home' | 'library' | 'wishlist';
type IconName = 'account' | 'back' | 'bookmark' | 'check' | 'chevron' | 'close' | 'forward' | 'heart' | 'menu' | 'pause' | 'play' | 'search' | 'skipBack' | 'skipForward' | 'volume';

function Icon({ name, size = 22, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  const paths: Record<IconName, React.ReactNode> = {
    account: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    back: <path d="m15 18-6-6 6-6" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    forward: <path d="m9 18 6-6-6-6" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    skipBack: <><path d="M5 5v14" /><path d="m19 6-9 6 9 6V6Z" /></>,
    skipForward: <><path d="M19 5v14" /><path d="m5 6 9 6-9 6V6Z" /></>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Logo() {
  return <span className="audible-logo" aria-label="Audible"><strong>audible</strong><span><i /><i /><i /><i /></span></span>;
}

function Stars({ rating, ratings }: { rating: number; ratings?: number }) {
  return <span className="stars" aria-label={`${rating} out of 5 stars`}><b>★★★★★</b><span>{rating}</span>{ratings !== undefined && <em>({ratings.toLocaleString()})</em>}</span>;
}

function Cover({ title, className = '' }: { title: Title; className?: string }) {
  return <span className={`cover ${className}`} style={{ backgroundColor: title.accent }}><img src={title.image} alt={`Cover of ${title.title}`} loading="lazy" /><span className="cover-shade" /><span className="cover-label"><small>{title.badge}</small><strong>{title.title}</strong><em>{title.author}</em></span></span>;
}

function TitleCard({ title, onOpen, onPlay, inLibrary, wished, onLibrary, onWish }: { title: Title; onOpen: (title: Title) => void; onPlay: (title: Title) => void; inLibrary: boolean; wished: boolean; onLibrary: (id: string) => void; onWish: (id: string) => void }) {
  return (
    <article className="title-card">
      <button className="cover-button" onClick={() => onOpen(title)} aria-label={`Open ${title.title}`}><Cover title={title} /></button>
      <button className="card-play" onClick={() => onPlay(title)} aria-label={`Play ${title.title}`}><Icon name="play" size={19} filled /></button>
      <div className="card-copy">
        <span className="included">{title.included ? 'Included with membership' : title.badge}</span>
        <button className="card-title" onClick={() => onOpen(title)}>{title.title}</button>
        <p>By {title.author}</p>
        <p>Narrated by {title.narrator}</p>
        <Stars rating={title.rating} />
        <span className="duration">{formatDuration(title.duration)}</span>
      </div>
      <div className="card-actions">
        <button className={inLibrary ? 'active' : ''} onClick={() => onLibrary(title.id)} aria-label={inLibrary ? 'Remove from library' : 'Add to library'}><Icon name={inLibrary ? 'check' : 'bookmark'} size={18} />{inLibrary ? 'In Library' : 'Library'}</button>
        <button className={wished ? 'active' : ''} onClick={() => onWish(title.id)} aria-label={wished ? 'Remove from wish list' : 'Add to wish list'}><Icon name="heart" size={18} filled={wished} /></button>
      </div>
    </article>
  );
}

function Header({ view, setView, query, setQuery, onSearch, accountOpen, setAccountOpen }: { view: View; setView: (view: View) => void; query: string; setQuery: (value: string) => void; onSearch: (event: FormEvent) => void; accountOpen: boolean; setAccountOpen: (open: boolean) => void }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="menu-button" aria-label="Open menu"><Icon name="menu" /></button>
        <button className="logo-button" onClick={() => setView('home')}><Logo /></button>
        <nav aria-label="Main navigation">
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Browse</button>
          <button className={view === 'library' ? 'active' : ''} onClick={() => setView('library')}>Library</button>
          <button className={view === 'wishlist' ? 'active' : ''} onClick={() => setView('wishlist')}>Wish List</button>
        </nav>
        <form className="header-search" onSubmit={onSearch} role="search"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find your next great listen" aria-label="Search audiobooks" /><button type="submit">Search</button></form>
        <button className="signin-button" onClick={() => setAccountOpen(!accountOpen)}><Icon name="account" size={20} /><span>Sign in</span></button>
      </div>
      {accountOpen && <div className="account-menu"><h3>Welcome to Audible</h3><p>Sign in to sync your library and listening position across devices.</p><button>Sign in</button><span>New to Audible? <a href="#membership">Start your trial</a></span></div>}
    </header>
  );
}

function Player({ title, playing, progress, duration, speed, onTogglePlay, onSeek, onSpeed, onVolume, onExpand }: { title: Title; playing: boolean; progress: number; duration: number; speed: number; onTogglePlay: () => void; onSeek: (progress: number) => void; onSpeed: (speed: number) => void; onVolume: (volume: number) => void; onExpand: () => void }) {
  const speedOptions = [1, 1.25, 1.5, 1.75, 2];
  const cycleSpeed = () => onSpeed(speedOptions[(speedOptions.indexOf(speed) + 1) % speedOptions.length]);
  return (
    <aside className="player" aria-label="Audio player">
      <button className="player-title" onClick={onExpand}><Cover title={title} className="mini-cover" /><span><small>Demo narration</small><strong>{title.title}</strong><em>{title.author}</em></span></button>
      <div className="player-center">
        <div className="player-controls"><button aria-label="Previous chapter"><Icon name="skipBack" /></button><button aria-label="Go back 30 seconds" onClick={() => onSeek(Math.max(0, progress - 30))}><Icon name="back" /><small>30</small></button><button className="main-play" onClick={onTogglePlay} aria-label={playing ? 'Pause demo narration' : 'Play demo narration'}><Icon name={playing ? 'pause' : 'play'} size={25} filled /></button><button aria-label="Go forward 30 seconds" onClick={() => onSeek(Math.min(duration, progress + 30))}><Icon name="forward" /><small>30</small></button><button aria-label="Next chapter"><Icon name="skipForward" /></button></div>
        <div className="progress-row"><span>{formatClock(progress)}</span><input type="range" min="0" max={duration || 1} value={progress} onChange={(event) => onSeek(Number(event.target.value))} aria-label="Demo narration progress" style={{ '--progress': `${duration ? (progress / duration) * 100 : 0}%` } as React.CSSProperties} /><span>-{formatClock(Math.max(0, duration - progress))}</span></div>
      </div>
      <div className="player-options"><button className="speed" onClick={cycleSpeed} aria-label="Change playback speed">{speed}x</button><button aria-label="Volume"><Icon name="volume" /></button><input type="range" min="0" max="100" defaultValue="72" onChange={(event) => onVolume(Number(event.target.value) / 100)} aria-label="Volume" /></div>
    </aside>
  );
}

function TitleDialog({ title, onClose, onPlay, inLibrary, wished, onLibrary, onWish }: { title: Title; onClose: () => void; onPlay: (title: Title) => void; inLibrary: boolean; wished: boolean; onLibrary: (id: string) => void; onWish: (id: string) => void }) {
  return (
    <div className="overlay" onMouseDown={(event) => event.currentTarget === event.target && onClose()} role="presentation">
      <section className="title-dialog" role="dialog" aria-modal="true" aria-label={title.title}>
        <button className="close-dialog" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <div className="dialog-visual" style={{ background: `radial-gradient(circle at 50% 30%, ${title.accent} 0, #10091f 72%)` }}><Cover title={title} /></div>
        <div className="dialog-details"><span className="eyebrow">{title.badge}</span><h2>{title.title}</h2><p className="byline">By <a href="#author">{title.author}</a> · Narrated by <a href="#narrator">{title.narrator}</a></p><Stars rating={title.rating} ratings={title.ratings} /><p className="meta">{formatDuration(title.duration)} · {title.chapters} chapters · Unabridged</p><p className="description">{title.description}</p><div className="tag-list">{title.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="dialog-actions"><button className="primary" onClick={() => onPlay(title)}><Icon name="play" size={19} filled />Play sample</button><button className={inLibrary ? 'secondary active' : 'secondary'} onClick={() => onLibrary(title.id)}><Icon name={inLibrary ? 'check' : 'bookmark'} size={18} />{inLibrary ? 'In your Library' : 'Add to Library'}</button><button className={wished ? 'heart-button active' : 'heart-button'} onClick={() => onWish(title.id)} aria-label="Toggle wish list"><Icon name="heart" filled={wished} /></button></div><p className="fine-print">Fictional title created for this interface study. No purchase or subscription is required.</p></div>
      </section>
    </div>
  );
}

export default function App() {
  const [titles, setTitles] = useState<Title[]>(fallbackCatalog);
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [library, setLibrary] = useState(['far-side-midnight', 'atlas-small-joys', 'sleeping-forest']);
  const [wishlist, setWishlist] = useState(['sea-between-stars', 'quiet-courage']);
  const [selected, setSelected] = useState<Title | null>(null);
  const [current, setCurrent] = useState<Title>(fallbackCatalog[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [demoDuration, setDemoDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch('/api/titles').then((response) => response.ok ? response.json() as Promise<Title[]> : Promise.reject()).then((payload) => payload.length && setTitles(payload)).catch(() => setTitles(fallbackCatalog));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2300);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', Boolean(selected));
    return () => document.body.classList.remove('no-scroll');
  }, [selected]);

  const filtered = useMemo(() => {
    let available = titles;
    if (view === 'library') available = available.filter((title) => library.includes(title.id));
    if (view === 'wishlist') available = available.filter((title) => wishlist.includes(title.id));
    return filterTitles(available, submittedQuery, category);
  }, [titles, view, library, wishlist, submittedQuery, category]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setSubmittedQuery(query);
    setView('home');
    setAccountOpen(false);
    window.setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 30);
  };

  const playTitle = (title: Title) => {
    const audio = audioRef.current;
    if (current.id !== title.id && audio) {
      audio.currentTime = 0;
      setProgress(0);
    }
    setCurrent(title);
    if (audio) {
      void audio.play().then(() => setPlaying(true)).catch(() => setToast('Select play again to start the demo narration'));
    }
    setSelected(null);
    setToast(`Playing ${title.title}`);
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setToast('The demo narration could not start'));
    }
  };

  const seekSample = (position: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextPosition = Math.max(0, Math.min(Number.isFinite(audio.duration) ? audio.duration : demoDuration, position));
    audio.currentTime = nextPosition;
    setProgress(nextPosition);
  };

  const changeSpeed = (nextSpeed: number) => {
    setSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };

  const toggleLibrary = (id: string) => {
    const adding = !library.includes(id);
    setLibrary((ids) => toggleInCollection(ids, id));
    fetch(`/api/library/${encodeURIComponent(id)}`, { method: adding ? 'PUT' : 'DELETE' }).catch(() => undefined);
    setToast(adding ? 'Added to your Library' : 'Removed from your Library');
  };

  const toggleWish = (id: string) => {
    const adding = !wishlist.includes(id);
    setWishlist((ids) => toggleInCollection(ids, id));
    setToast(adding ? 'Added to your Wish List' : 'Removed from your Wish List');
  };

  const switchView = (nextView: View) => {
    setView(nextView);
    setSubmittedQuery('');
    setQuery('');
    setCategory('All');
    setAccountOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featured = titles[0] ?? fallbackCatalog[0];

  return (
    <div className="app-shell">
      <Header view={view} setView={switchView} query={query} setQuery={setQuery} onSearch={submitSearch} accountOpen={accountOpen} setAccountOpen={setAccountOpen} />
      <main>
        {view === 'home' && !submittedQuery && <>
          <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, #10091ff2 0%, #17102ee0 35%, #17102e73 68%, #17102e25 100%), url(${featured.image})` }}>
            <div className="hero-inner"><div className="hero-copy"><span className="eyebrow">Listen first on Audible</span><h1>Stories stay with us.</h1><h2>{featured.title}</h2><p>{featured.description}</p><p className="hero-byline">By {featured.author} · Narrated by {featured.narrator}</p><div className="hero-actions"><button className="primary" onClick={() => playTitle(featured)}><Icon name="play" size={19} filled />Listen now</button><button className="secondary light" onClick={() => setSelected(featured)}>See details</button></div></div><Cover title={featured} className="hero-cover" /></div>
          </section>
          <section id="membership" className="membership-strip"><div><span>New to Audible?</span><strong>Get 30 days free</strong><p>One title to keep plus unlimited listening from the included catalog.</p></div><button onClick={() => setToast('Demo membership preview opened')}>Start your free trial</button><small>$14.95/month after 30 days. Cancel anytime. Demo only.</small></section>
        </>}

        <div className="content">
          {view === 'home' && !submittedQuery && <>
            <section className="shelf continue-shelf"><div className="section-heading"><div><span>Pick up where you left off</span><h2>Continue listening</h2></div><button onClick={() => switchView('library')}>View Library <Icon name="chevron" size={16} /></button></div><div className="continue-grid">{library.slice(0, 3).map((id, index) => { const title = titles.find((item) => item.id === id); if (!title) return null; const percent = [36, 12, 68][index] ?? 20; return <article key={id} className="continue-card"><Cover title={title} /><div><span>{percent}% complete</span><h3>{title.title}</h3><p>{title.author}</p><div className="continue-progress"><i style={{ width: `${percent}%` }} /></div><button onClick={() => playTitle(title)}><Icon name="play" size={18} filled />Continue</button></div></article>; })}</div></section>

            <section className="mood-section"><div className="section-heading"><div><span>Find your next listen</span><h2>What are you in the mood for?</h2></div></div><div className="mood-grid">{categories.slice(1).map((item, index) => <button key={item} style={{ '--mood': ['#4c2b90', '#bd4b28', '#166a68', '#96559b', '#3c568e', '#8c5d26', '#b53561'][index % 7] } as React.CSSProperties} onClick={() => { setCategory(item); setSubmittedQuery(''); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}><span>{item}</span><Icon name="chevron" /></button>)}</div></section>
          </>}

          <section id="catalog" className="catalog-section">
            <div className="section-heading catalog-heading"><div><span>{view === 'library' ? 'Your collection' : view === 'wishlist' ? 'Saved for later' : submittedQuery || category !== 'All' ? 'Browse results' : 'Only from Audible'}</span><h2>{view === 'library' ? 'Library' : view === 'wishlist' ? 'Wish List' : submittedQuery ? `Results for “${submittedQuery}”` : category !== 'All' ? category : 'Outstanding audio, made for listening'}</h2></div>{(submittedQuery || category !== 'All') && <button onClick={() => { setSubmittedQuery(''); setQuery(''); setCategory('All'); }}>Clear filters</button>}</div>
            {view === 'home' && <div className="category-chips">{categories.map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>}
            {filtered.length ? <div className="title-grid">{filtered.map((title) => <TitleCard key={title.id} title={title} onOpen={setSelected} onPlay={playTitle} inLibrary={library.includes(title.id)} wished={wishlist.includes(title.id)} onLibrary={toggleLibrary} onWish={toggleWish} />)}</div> : <div className="empty-state"><Icon name={view === 'wishlist' ? 'heart' : view === 'library' ? 'bookmark' : 'search'} size={48} /><h3>{view === 'library' ? 'Your Library is ready for a new story' : view === 'wishlist' ? 'Your Wish List is empty' : 'No listens match that search'}</h3><p>Browse the catalog and save a title to find it here.</p><button className="primary" onClick={() => switchView('home')}>Browse titles</button></div>}
          </section>
        </div>
      </main>

      <footer><div className="footer-main"><Logo /><div><h3>Discover</h3><a href="#catalog">Best sellers</a><a href="#catalog">New releases</a><a href="#catalog">Audible Originals</a></div><div><h3>Audible</h3><a href="#membership">Membership</a><a href="#top">Help Center</a><a href="#top">Accessibility</a></div><div><h3>Connect</h3><a href="#top">About this copy</a><a href="#top">Careers</a><a href="#top">Gift center</a></div></div><p>Fictional interface study. Not affiliated with or endorsed by Audible.</p></footer>

      <audio
        ref={audioRef}
        src="/audio/audible-demo-narration.wav"
        preload="metadata"
        onLoadedMetadata={(event) => setDemoDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); if (audioRef.current) audioRef.current.currentTime = 0; }}
      />
      <Player title={current} playing={playing} progress={progress} duration={demoDuration} speed={speed} onTogglePlay={togglePlayback} onSeek={seekSample} onSpeed={changeSpeed} onVolume={(volume) => { if (audioRef.current) audioRef.current.volume = volume; }} onExpand={() => setSelected(current)} />
      {selected && <TitleDialog title={selected} onClose={() => setSelected(null)} onPlay={playTitle} inLibrary={library.includes(selected.id)} wished={wishlist.includes(selected.id)} onLibrary={toggleLibrary} onWish={toggleWish} />}
      {toast && <div className="toast" role="status"><Icon name="check" size={18} />{toast}</div>}
    </div>
  );
}
