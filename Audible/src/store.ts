import catalogData from '../data/catalog.json';

export type Title = {
  id: string;
  title: string;
  author: string;
  narrator: string;
  category: string;
  duration: number;
  rating: number;
  ratings: number;
  included: boolean;
  badge: string;
  image: string;
  accent: string;
  description: string;
  tags: string[];
  chapters: number;
};

export const catalog = catalogData as Title[];
export const categories = ['All', ...new Set(catalog.map((title) => title.category))];

export function filterTitles(titles: Title[], query: string, category = 'All') {
  const needle = query.trim().toLocaleLowerCase();
  return titles.filter((title) => {
    const categoryMatches = category === 'All' || title.category === category;
    const haystack = `${title.title} ${title.author} ${title.narrator} ${title.category} ${title.tags.join(' ')}`.toLocaleLowerCase();
    return categoryMatches && (!needle || haystack.includes(needle));
  });
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return hours ? `${hours} hr ${minutes} min` : `${minutes} min`;
}

export function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function toggleInCollection(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

