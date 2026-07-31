import feed from './feed.json';

export const fallbackFeed = feed;

export function filterVideos(videos, category = 'All', query = '', view = 'home') {
  const normalized = query.trim().toLowerCase();
  return videos.filter((video) => {
    const categoryMatch =
      category === 'All' ||
      category === 'Recently uploaded' ||
      category === 'Mixes' ||
      video.category === category;
    const queryMatch =
      !normalized ||
      [video.title, video.channel, video.category, video.description]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    const viewMatch = view !== 'subscriptions' || ['Nomad Frames', 'Made Simple', 'Field Notes'].includes(video.channel);
    return categoryMatch && queryMatch && viewMatch;
  });
}

export function getRecommendations(videos, selectedId) {
  return videos.filter((video) => video.id !== selectedId);
}
