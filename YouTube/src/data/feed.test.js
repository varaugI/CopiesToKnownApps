import { fallbackFeed, filterVideos, getRecommendations } from './feed';

test('ships a complete home feed', () => {
  expect(fallbackFeed.videos).toHaveLength(12);
  expect(fallbackFeed.shorts).toHaveLength(6);
});

test('filters by category and search text', () => {
  expect(filterVideos(fallbackFeed.videos, 'Cooking')).toHaveLength(2);
  expect(filterVideos(fallbackFeed.videos, 'All', 'Tokyo')[0].id).toBe('city-after-dark');
});

test('does not recommend the currently playing video', () => {
  const recommendations = getRecommendations(fallbackFeed.videos, 'desk-setup');
  expect(recommendations.some((video) => video.id === 'desk-setup')).toBe(false);
});
