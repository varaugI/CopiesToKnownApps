import catalogData from '../../data/catalog.json';

export type Product = {
  id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  listPrice: number;
  rating: number;
  reviews: number;
  prime: boolean;
  badge: string;
  image: string;
  accent: string;
  description: string;
  features: string[];
};

export const catalog = catalogData as Product[];

export const categories = [
  'All',
  'Amazon devices',
  'Books',
  'Computers',
  'Electronics',
  'Fashion',
  'Garden',
  'Home & Kitchen',
];

export const categoryTiles = [
  { title: 'Refresh your space', category: 'Home & Kitchen', image: catalog[3].image, copy: 'Easy updates for every room' },
  { title: 'Top picks in tech', category: 'Electronics', image: catalog[0].image, copy: 'Sound, screens, and smart devices' },
  { title: 'Style for the season', category: 'Fashion', image: catalog[4].image, copy: 'Everyday essentials under $75' },
  { title: 'Make work flow', category: 'Computers', image: catalog[9].image, copy: 'A better desk starts here' },
];

export const heroSlides = [
  {
    eyebrow: 'Fresh finds for your space',
    title: 'A little reset goes a long way',
    copy: 'Warm light, considered details, and everyday upgrades for the rooms you use most.',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=84',
    tone: 'light',
  },
  {
    eyebrow: 'Work and play, untangled',
    title: 'Tech that fits your rhythm',
    copy: 'Thoughtful gear for clear calls, focused work, and better listening.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1800&q=84',
    tone: 'dark',
  },
  {
    eyebrow: 'Pack light. Go farther.',
    title: 'Ready for the weekend',
    copy: 'Comfortable layers and practical picks for wherever the day takes you.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1800&q=84',
    tone: 'dark',
  },
];

