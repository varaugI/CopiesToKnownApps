export const PROFILES = [
  {
    id: 'p1',
    name: 'Gaurav',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    color: '#E50914',
    isKids: false
  },
  {
    id: 'p2',
    name: 'Cinema Buff',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    color: '#0071EB',
    isKids: false
  },
  {
    id: 'p3',
    name: 'Kids Zone',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
    color: '#E5A93C',
    isKids: true
  },
  {
    id: 'p4',
    name: 'Sci-Fi Fanatic',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
    color: '#2BDB66',
    isKids: false
  }
];

export const SAMPLE_VIDEOS = {
  cyberpunk: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  space: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  nature: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  action: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  drama: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  thriller: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
};

export const MOVIES = [
  {
    id: 'm1',
    title: 'Cyber Chronicles: 2099',
    type: 'Series',
    seasons: '3 Seasons',
    matchScore: 98,
    releaseYear: 2024,
    ageRating: '18+',
    resolution: '4K Ultra HD',
    audioQuality: '5.1 Dolby Atmos',
    duration: '45m per ep',
    overview: 'In a dystopian mega-city ruled by ruthless AI syndicates, a rogue netrunner discovers a secret neural artifact that could rewrite human consciousness forever.',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: SAMPLE_VIDEOS.cyberpunk,
    videoUrl: SAMPLE_VIDEOS.cyberpunk,
    categories: ['Trending Now', 'Sci-Fi Blockbusters', 'Top 10 Today'],
    topRank: 1,
    genres: ['Sci-Fi', 'Cyberpunk', 'Action', 'Thriller'],
    cast: ['Elena Rostova', 'Marcus Vance', 'Kaito Tanaka', 'Dr. Aris Thorne'],
    director: 'Denis Villeneuve',
    tags: ['Mind-Bending', 'Visually Stunning', 'Dark', 'Gritty'],
    episodes: [
      {
        id: 'e1',
        number: 1,
        title: 'Neural Drift',
        duration: '52m',
        summary: 'Kael takes on a dangerous freelance hack in Sector 9, unaware that the target node contains classified military AI protocols.',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'e2',
        number: 2,
        title: 'Ghost in the Lattice',
        duration: '48m',
        summary: 'Evading corporate hunters, Kael seeks refuge in the Neon Alley sub-levels with an underground cyber surgeon.',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  {
    id: 'm2',
    title: 'The Eclipse Protocol',
    type: 'Movie',
    matchScore: 96,
    releaseYear: 2025,
    ageRating: '16+',
    resolution: 'HDR10+',
    audioQuality: 'Spatial Audio',
    duration: '2h 18m',
    overview: 'When a solar observatory detects an artificial shadow enveloping Jupiter, a team of elite astronauts embarks on a silent reconnaissance mission beyond the asteroid belt.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: SAMPLE_VIDEOS.space,
    videoUrl: SAMPLE_VIDEOS.space,
    categories: ['Trending Now', 'Sci-Fi Blockbusters', 'Popular Movies'],
    topRank: 2,
    genres: ['Space Sci-Fi', 'Suspense', 'Mystery'],
    cast: ['Sarah Jenkins', 'David Oyelowo', 'Ken Watanabe'],
    director: 'Christopher Nolan',
    tags: ['Suspenseful', 'Epic Scope', 'Scientific', 'Cerebral']
  },
  {
    id: 'm3',
    title: 'Shadow Syndicate: Tokyo',
    type: 'Series',
    seasons: '2 Seasons',
    matchScore: 99,
    releaseYear: 2023,
    ageRating: '18+',
    resolution: '4K Ultra HD',
    audioQuality: '5.1 Surround',
    duration: '50m per ep',
    overview: 'An undercover detective infiltrates Tokyo’s subterranean crime underground to avenge his fallen partner, uncovering a conspiracy spanning politicians and syndicate heads.',
    poster: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: SAMPLE_VIDEOS.thriller,
    videoUrl: SAMPLE_VIDEOS.thriller,
    categories: ['Trending Now', 'Action & Thrillers', 'Top 10 Today'],
    topRank: 3,
    genres: ['Crime', 'Action', 'Neo-Noir'],
    cast: ['Ren Amamiya', 'Sofia Boutella', 'Hiroyuki Sanada'],
    director: 'Takashi Miike',
    tags: ['Adrenaline', 'Stylized', 'Martial Arts', 'Violent']
  },
  {
    id: 'm4',
    title: 'Crown of Wildlands',
    type: 'Series',
    seasons: '4 Seasons',
    matchScore: 94,
    releaseYear: 2024,
    ageRating: '16+',
    resolution: '4K Ultra HD',
    audioQuality: 'Dolby Atmos',
    duration: '1h 02m per ep',
    overview: 'Four warring feudal clans compete for ancient runes that control the seasonal elemental balance, risking eternal frost across the continent.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: SAMPLE_VIDEOS.nature,
    videoUrl: SAMPLE_VIDEOS.nature,
    categories: ['Popular Movies', 'Fantasy & Adventure', 'Top 10 Today'],
    topRank: 4,
    genres: ['Fantasy', 'Adventure', 'Drama'],
    cast: ['Alexander Skarsgård', 'Freya Allan', 'Mads Mikkelsen'],
    director: 'Peter Jackson',
    tags: ['Mythical', 'Breathtaking Scenery', 'Political Intrigue']
  },
  {
    id: 'm5',
    title: 'Formula Velocity: Season 5',
    type: 'Docuseries',
    seasons: '5 Seasons',
    matchScore: 97,
    releaseYear: 2025,
    ageRating: '13+',
    resolution: '4K Ultra HD',
    audioQuality: '5.1 Surround',
    duration: '42m per ep',
    overview: 'Unfiltered access behind the pit lanes of global hypercar motorsport racing as rookies challenge multi-time world champions for ultimate glory.',
    poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: SAMPLE_VIDEOS.drama,
    videoUrl: SAMPLE_VIDEOS.drama,
    categories: ['Trending Now', 'Documentaries & Sports', 'Top 10 Today'],
    topRank: 5,
    genres: ['Documentary', 'Sports', 'High Octane'],
    cast: ['Lewis Hamilton', 'Max Verstappen', 'Charles Leclerc'],
    director: 'James Mangold',
    tags: ['Fast-Paced', 'Inspiring', 'Real-Life Drama']
  }
];

export const CATEGORIES = [
  'Trending Now',
  'Top 10 Today',
  'Sci-Fi Blockbusters',
  'Action & Thrillers',
  'Popular Movies',
  'Documentaries & Sports'
];
