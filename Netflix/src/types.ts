export type Title = {
  id: number;
  name: string;
  eyebrow: string;
  year: number;
  maturity: string;
  duration: string;
  match: number;
  genres: string[];
  synopsis: string;
  cast: string[];
  landscape: string;
  backdrop: string;
  accent: string;
  rank?: number;
  progress?: number;
  isNew?: boolean;
  type: 'Movie' | 'Series';
};

export type Profile = {
  id: string;
  name: string;
  color: string;
  face: string;
  kids?: boolean;
};

export type CatalogResponse = {
  featured: Title;
  rows: {
    slug: string;
    name: string;
    titleIds: number[];
  }[];
  titles: Title[];
};
