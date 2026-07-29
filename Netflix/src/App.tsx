import {
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Info,
  Menu,
  Play,
  Plus,
  Search,
  ThumbsUp,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { fallbackCatalog, profiles } from './data/catalog';
import type { CatalogResponse, Profile, Title } from './types';

const playerSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand${compact ? ' brand--compact' : ''}`} aria-label="Netflix">
      {compact ? 'N' : 'NETFLIX'}
    </span>
  );
}

function ProfileAvatar({ profile, small = false }: { profile: Profile; small?: boolean }) {
  return (
    <span
      className={`profile-avatar${small ? ' profile-avatar--small' : ''}`}
      style={{ '--avatar-color': profile.color } as CSSProperties}
      aria-hidden="true"
    >
      <span>{profile.face}</span>
    </span>
  );
}

function ProfileGate({ onChoose }: { onChoose: (profile: Profile) => void }) {
  return (
    <main className="profile-gate">
      <header className="profile-gate__header">
        <Logo />
      </header>
      <section className="profile-gate__content" aria-labelledby="profile-title">
        <h1 id="profile-title">Who&apos;s watching?</h1>
        <div className="profile-grid">
          {profiles.map((profile) => (
            <button
              className="profile-choice"
              key={profile.id}
              onClick={() => onChoose(profile)}
              type="button"
            >
              <ProfileAvatar profile={profile} />
              <span>{profile.name}</span>
            </button>
          ))}
        </div>
        <button className="manage-button" type="button">
          Manage Profiles
        </button>
      </section>
    </main>
  );
}

type HeaderProps = {
  activePage: string;
  profile: Profile;
  query: string;
  scrolled: boolean;
  onNavigate: (page: string) => void;
  onQuery: (query: string) => void;
  onSwitchProfile: () => void;
};

function Header({
  activePage,
  profile,
  query,
  scrolled,
  onNavigate,
  onQuery,
  onSwitchProfile,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pages = ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'];

  return (
    <header className={`site-header${scrolled ? ' site-header--solid' : ''}`}>
      <div className="header-left">
        <a className="logo-link" href="#top" onClick={() => onNavigate('Home')}>
          <Logo />
        </a>
        <button className="mobile-menu" type="button" aria-label="Open navigation">
          <Menu size={22} />
          <span>Browse</span>
          <ChevronDown size={14} />
        </button>
        <nav className="primary-nav" aria-label="Primary navigation">
          {pages.map((page) => (
            <button
              className={activePage === page ? 'active' : ''}
              key={page}
              onClick={() => onNavigate(page)}
              type="button"
            >
              {page}
            </button>
          ))}
        </nav>
      </div>

      <div className="header-actions">
        <label className={`search-control${searchOpen ? ' search-control--open' : ''}`}>
          <Search size={21} strokeWidth={2.2} />
          <input
            aria-label="Search titles, people and genres"
            onBlur={() => !query && setSearchOpen(false)}
            onChange={(event) => onQuery(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Titles, people, genres"
            value={query}
          />
          <button
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            onClick={() => {
              if (searchOpen && query) onQuery('');
              setSearchOpen((open) => !open);
            }}
            type="button"
          >
            {searchOpen ? <X size={18} /> : <span />}
          </button>
        </label>
        <button
          className="notification-button"
          aria-label="Notifications"
          onClick={() => setNotificationsOpen((open) => !open)}
          type="button"
        >
          <Bell size={21} fill="currentColor" />
          <span className="notification-dot" />
        </button>
        {notificationsOpen && (
          <aside className="notification-popover">
            <div className="notification-popover__item">
              <span className="notification-art">N</span>
              <span>
                <strong>New arrival</strong>
                <small>The Last Horizon is now streaming.</small>
              </span>
            </div>
            <div className="notification-popover__item">
              <span className="notification-art notification-art--blue">▶</span>
              <span>
                <strong>Continue watching</strong>
                <small>Blackout · 38 minutes left</small>
              </span>
            </div>
          </aside>
        )}
        <div className="profile-menu">
          <button
            className="profile-menu__trigger"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
            type="button"
          >
            <ProfileAvatar profile={profile} small />
            <ChevronDown size={14} className={profileOpen ? 'rotate' : ''} />
          </button>
          {profileOpen && (
            <div className="profile-popover">
              <span className="profile-popover__arrow" />
              {profiles
                .filter((item) => item.id !== profile.id)
                .map((item) => (
                  <button key={item.id} onClick={onSwitchProfile} type="button">
                    <ProfileAvatar profile={item} small />
                    <span>{item.name}</span>
                  </button>
                ))}
              <button onClick={onSwitchProfile} type="button">
                <span className="profile-icon">✎</span>
                <span>Manage Profiles</span>
              </button>
              <hr />
              <button type="button">Account</button>
              <button type="button">Help Centre</button>
              <button onClick={onSwitchProfile} type="button">
                Sign out of Netflix
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

type HeroProps = {
  title: Title;
  muted: boolean;
  onMutedChange: () => void;
  onInfo: () => void;
  onPlay: () => void;
};

function Hero({ title, muted, onMutedChange, onInfo, onPlay }: HeroProps) {
  return (
    <section
      className="hero"
      id="top"
      style={{ '--hero-image': `url("${title.backdrop}")` } as CSSProperties}
    >
      <div className="hero__shade" />
      <div className="hero__content">
        <span className="netflix-kind">
          <Logo compact />
          <span>{title.type === 'Movie' ? 'FILM' : 'SERIES'}</span>
        </span>
        <h1>{title.name}</h1>
        <div className="hero__rank">
          <span>TOP</span>
          <strong>10</strong>
          <b>#1 in TV Shows Today</b>
        </div>
        <p>{title.synopsis}</p>
        <div className="hero__actions">
          <button className="button button--play" onClick={onPlay} type="button">
            <Play size={28} fill="currentColor" />
            Play
          </button>
          <button className="button button--info" onClick={onInfo} type="button">
            <Info size={27} />
            More Info
          </button>
        </div>
      </div>
      <div className="hero__rating">
        <button
          aria-label={muted ? 'Turn sound on' : 'Mute'}
          className="round-control"
          onClick={onMutedChange}
          type="button"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <span>{title.maturity}</span>
      </div>
    </section>
  );
}

type TitleCardProps = {
  item: Title;
  listed: boolean;
  rank?: number;
  onInfo: (item: Title) => void;
  onList: (id: number) => void;
  onPlay: (item: Title) => void;
};

function TitleCard({ item, listed, rank, onInfo, onList, onPlay }: TitleCardProps) {
  return (
    <article className={`title-card${rank ? ' title-card--ranked' : ''}`}>
      {rank && <span className="rank-number">{rank}</span>}
      <div className="title-card__body">
        <button
          className="title-card__image"
          aria-label={`More information about ${item.name}`}
          onClick={() => onInfo(item)}
          type="button"
        >
          <img alt="" loading="lazy" src={item.landscape} />
          <span className="title-card__name">{item.name}</span>
          {item.progress !== undefined && (
            <span className="progress-bar">
              <span style={{ width: `${item.progress}%` }} />
            </span>
          )}
        </button>
        <div className="title-card__preview">
          <button className="title-card__preview-image" onClick={() => onInfo(item)} type="button">
            <img alt="" src={item.landscape} />
            <span>{item.name}</span>
          </button>
          <div className="preview-copy">
            <div className="preview-actions">
              <button
                className="icon-button icon-button--light"
                aria-label={`Play ${item.name}`}
                onClick={() => onPlay(item)}
                type="button"
              >
                <Play size={17} fill="currentColor" />
              </button>
              <button
                className="icon-button"
                aria-label={listed ? `Remove ${item.name} from My List` : `Add ${item.name} to My List`}
                onClick={() => onList(item.id)}
                type="button"
              >
                {listed ? <Check size={18} /> : <Plus size={19} />}
              </button>
              <button className="icon-button" aria-label={`I like ${item.name}`} type="button">
                <ThumbsUp size={17} />
              </button>
              <button
                className="icon-button preview-info"
                aria-label={`More information about ${item.name}`}
                onClick={() => onInfo(item)}
                type="button"
              >
                <ChevronDown size={19} />
              </button>
            </div>
            <div className="preview-meta">
              <strong>{item.match}% Match</strong>
              <span>{item.maturity}</span>
              <b>HD</b>
            </div>
            <div className="preview-genres">
              {item.genres.slice(0, 3).map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

type ContentRowProps = {
  name: string;
  items: Title[];
  list: Set<number>;
  ranked?: boolean;
  onInfo: (item: Title) => void;
  onList: (id: number) => void;
  onPlay: (item: Title) => void;
};

function ContentRow({ name, items, list, ranked, onInfo, onList, onPlay }: ContentRowProps) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.82,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`content-row${ranked ? ' content-row--ranked' : ''}`}>
      <h2>
        {name}
        <span>
          Explore All <ChevronRight size={15} />
        </span>
      </h2>
      <div className="slider">
        <button
          aria-label={`Scroll ${name} left`}
          className="slider-arrow slider-arrow--left"
          onClick={() => scroll(-1)}
          type="button"
        >
          <ChevronLeft size={35} />
        </button>
        <div className="slider-track" ref={track}>
          {items.map((item, index) => (
            <TitleCard
              item={item}
              key={`${name}-${item.id}`}
              listed={list.has(item.id)}
              onInfo={onInfo}
              onList={onList}
              onPlay={onPlay}
              rank={ranked ? index + 1 : undefined}
            />
          ))}
        </div>
        <button
          aria-label={`Scroll ${name} right`}
          className="slider-arrow slider-arrow--right"
          onClick={() => scroll(1)}
          type="button"
        >
          <ChevronRight size={35} />
        </button>
      </div>
    </section>
  );
}

type DetailsModalProps = {
  item: Title;
  listed: boolean;
  onClose: () => void;
  onList: (id: number) => void;
  onPlay: (item: Title) => void;
};

function DetailsModal({ item, listed, onClose, onList, onPlay }: DetailsModalProps) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', close);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <section
        aria-label={`${item.name} details`}
        aria-modal="true"
        className="details-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div
          className="details-modal__hero"
          style={{ '--modal-image': `url("${item.backdrop}")` } as CSSProperties}
        >
          <button className="modal-close" aria-label="Close" onClick={onClose} type="button">
            <X size={22} />
          </button>
          <div className="details-modal__title">
            <span className="netflix-kind">
              <Logo compact />
              <span>{item.type.toUpperCase()}</span>
            </span>
            <h2>{item.name}</h2>
            <div>
              <button className="button button--play" onClick={() => onPlay(item)} type="button">
                <Play size={23} fill="currentColor" />
                Play
              </button>
              <button
                className="icon-button icon-button--large"
                aria-label={listed ? 'Remove from My List' : 'Add to My List'}
                onClick={() => onList(item.id)}
                type="button"
              >
                {listed ? <Check /> : <Plus />}
              </button>
              <button className="icon-button icon-button--large" aria-label="I like this" type="button">
                <ThumbsUp />
              </button>
            </div>
          </div>
        </div>
        <div className="details-modal__copy">
          <div>
            <p className="details-meta">
              <strong>{item.match}% Match</strong>
              <span>{item.year}</span>
              <span>{item.duration}</span>
              <b>HD</b>
              <b>5.1</b>
            </p>
            <p className="details-maturity">{item.maturity} · language, violence</p>
            <p className="details-synopsis">{item.synopsis}</p>
          </div>
          <dl>
            <div>
              <dt>Cast:</dt>
              <dd>{item.cast.join(', ')}</dd>
            </div>
            <div>
              <dt>Genres:</dt>
              <dd>{item.genres.join(', ')}</dd>
            </div>
            <div>
              <dt>This show is:</dt>
              <dd>Suspenseful, imaginative</dd>
            </div>
          </dl>
        </div>
        {item.type === 'Series' && (
          <section className="episodes">
            <div className="episodes__heading">
              <h3>Episodes</h3>
              <select aria-label="Season">
                <option>Season 1</option>
              </select>
            </div>
            {[1, 2, 3].map((episode) => (
              <article className="episode" key={episode}>
                <strong>{episode}</strong>
                <div className="episode__art">
                  <img alt="" src={item.landscape} />
                  <Play size={24} fill="white" />
                </div>
                <div>
                  <span>
                    <b>{['The Signal', 'A Line in the Dark', 'No Way Home'][episode - 1]}</b>
                    <small>{44 + episode * 3}m</small>
                  </span>
                  <p>
                    A new discovery raises the stakes as the crew is forced to choose between the
                    mission and one another.
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </div>
  );
}

function Player({ item, onClose }: { item: Title; onClose: () => void }) {
  return (
    <div className="player" role="dialog" aria-modal="true" aria-label={`Playing ${item.name}`}>
      <video autoPlay controls poster={item.backdrop} src={playerSource} />
      <div className="player__top">
        <button aria-label="Close player" onClick={onClose} type="button">
          <ChevronLeft size={38} />
        </button>
        <span>
          <small>Now playing</small>
          <strong>{item.name}</strong>
        </span>
      </div>
      <div className="player__notice">
        <Logo compact />
        <span>Demo playback</span>
      </div>
    </div>
  );
}

function SearchResults({
  query,
  results,
  list,
  onInfo,
  onList,
  onPlay,
}: {
  query: string;
  results: Title[];
  list: Set<number>;
  onInfo: (item: Title) => void;
  onList: (id: number) => void;
  onPlay: (item: Title) => void;
}) {
  return (
    <main className="search-page">
      <p>
        Explore titles related to: <strong>{query}</strong>
      </p>
      {results.length ? (
        <div className="search-grid">
          {results.map((item) => (
            <TitleCard
              item={item}
              key={item.id}
              listed={list.has(item.id)}
              onInfo={onInfo}
              onList={onList}
              onPlay={onPlay}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CircleHelp size={44} />
          <h1>No matches found</h1>
          <p>Try a title, actor, or genre such as “Drama” or “Sci-Fi”.</p>
        </div>
      )}
    </main>
  );
}

function Footer() {
  const links = [
    'Audio Description',
    'Help Centre',
    'Gift Cards',
    'Media Centre',
    'Investor Relations',
    'Jobs',
    'Terms of Use',
    'Privacy',
    'Legal Notices',
    'Cookie Preferences',
    'Corporate Information',
    'Contact Us',
  ];
  return (
    <footer className="site-footer">
      <div className="socials">
        <span>f</span>
        <span>◎</span>
        <span>▶</span>
      </div>
      <div className="footer-links">
        {links.map((link) => (
          <a href="#top" key={link}>
            {link}
          </a>
        ))}
      </div>
      <button type="button">Service Code</button>
      <p>© 2026 Netflix interface study. For learning and demonstration only.</p>
    </footer>
  );
}

export default function App() {
  const [catalog, setCatalog] = useState<CatalogResponse>(fallbackCatalog);
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('netflix-copy-profile');
    const preview = new URLSearchParams(window.location.search).get('profile');
    return profiles.find((item) => item.id === (saved ?? preview)) ?? null;
  });
  const [activePage, setActivePage] = useState('Home');
  const [query, setQuery] = useState('');
  const [muted, setMuted] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [selected, setSelected] = useState<Title | null>(null);
  const [playing, setPlaying] = useState<Title | null>(null);
  const [myList, setMyList] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('netflix-copy-list');
    return new Set(saved ? (JSON.parse(saved) as number[]) : [1, 3]);
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/catalog', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Catalog service unavailable');
        return response.json() as Promise<CatalogResponse>;
      })
      .then(setCatalog)
      .catch(() => {
        // The bundled catalog deliberately keeps the client useful without Java running.
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('netflix-copy-list', JSON.stringify([...myList]));
  }, [myList]);

  const titleById = useMemo(
    () => new Map(catalog.titles.map((title) => [title.id, title])),
    [catalog.titles],
  );

  const visibleRows = useMemo(() => {
    if (activePage === 'My List') {
      return [
        {
          slug: 'my-list',
          name: 'My List',
          items: catalog.titles.filter((item) => myList.has(item.id)),
        },
      ];
    }

    const byPage = catalog.titles.filter((item) => {
      if (activePage === 'TV Shows') return item.type === 'Series';
      if (activePage === 'Movies') return item.type === 'Movie';
      if (activePage === 'New & Popular') return item.isNew || item.rank;
      return true;
    });

    return catalog.rows.map((row) => ({
      ...row,
      items: row.titleIds
        .map((id) => titleById.get(id))
        .filter((item): item is Title => Boolean(item))
        .filter((item) => byPage.some((candidate) => candidate.id === item.id)),
    }));
  }, [activePage, catalog.rows, catalog.titles, myList, titleById]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return catalog.titles.filter((item) =>
      [item.name, item.type, ...item.genres, ...item.cast]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [catalog.titles, query]);

  const toggleList = (id: number) => {
    setMyList((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chooseProfile = (nextProfile: Profile) => {
    localStorage.setItem('netflix-copy-profile', nextProfile.id);
    setProfile(nextProfile);
  };

  const navigate = (page: string) => {
    setActivePage(page);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openInfo = (item: Title) => setSelected(item);
  const closeInfo = () => setSelected(null);
  const openPlayer = (item: Title) => {
    setSelected(null);
    setPlaying(item);
  };
  if (!profile) return <ProfileGate onChoose={chooseProfile} />;

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        onNavigate={navigate}
        onQuery={setQuery}
        onSwitchProfile={() => {
          localStorage.removeItem('netflix-copy-profile');
          setProfile(null);
        }}
        profile={profile}
        query={query}
        scrolled={scrolled}
      />

      {query.trim() ? (
        <SearchResults
          list={myList}
          onInfo={openInfo}
          onList={toggleList}
          onPlay={openPlayer}
          query={query}
          results={searchResults}
        />
      ) : (
        <main>
          {activePage === 'Home' && (
            <Hero
              muted={muted}
              onInfo={() => openInfo(catalog.featured)}
              onMutedChange={() => setMuted((value) => !value)}
              onPlay={() => openPlayer(catalog.featured)}
              title={catalog.featured}
            />
          )}
          {activePage !== 'Home' && (
            <section
              className="page-banner"
              style={{ '--page-image': `url("${catalog.featured.backdrop}")` } as CSSProperties}
            >
              <div>
                <span>Browse</span>
                <h1>{activePage}</h1>
                <p>Stories selected for {profile.name}.</p>
              </div>
            </section>
          )}

          <div className={activePage === 'Home' ? 'rows rows--overlap' : 'rows'}>
            {visibleRows.map((row) =>
              row.items.length ? (
                <ContentRow
                  items={row.items}
                  key={row.slug}
                  list={myList}
                  name={
                    row.slug === 'continue'
                      ? `Continue Watching for ${profile.name}`
                      : row.name
                  }
                  onInfo={openInfo}
                  onList={toggleList}
                  onPlay={openPlayer}
                  ranked={row.slug === 'top-ten'}
                />
              ) : null,
            )}
            {activePage === 'My List' && myList.size === 0 && (
              <div className="empty-state empty-state--page">
                <Plus size={46} />
                <h1>Your list is waiting</h1>
                <p>Add shows and movies so you can find them here anytime.</p>
                <button className="button button--play" onClick={() => navigate('Home')} type="button">
                  Browse titles
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      <Footer />

      {selected && (
        <DetailsModal
          item={selected}
          listed={myList.has(selected.id)}
          onClose={closeInfo}
          onList={toggleList}
          onPlay={openPlayer}
        />
      )}
      {playing && <Player item={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
