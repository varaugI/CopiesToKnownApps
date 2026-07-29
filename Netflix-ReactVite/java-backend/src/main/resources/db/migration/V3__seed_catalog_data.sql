-- StreamFlix Seed Catalog Migration V3

-- Insert Genres
INSERT INTO genres (id, name, slug) VALUES
('g-action', 'Action', 'action'),
('g-drama', 'Drama', 'drama'),
('g-scifi', 'Sci-Fi', 'sci-fi'),
('g-thriller', 'Thriller', 'thriller'),
('g-comedy', 'Comedy', 'comedy'),
('g-horror', 'Horror', 'horror');

-- Insert Titles
INSERT INTO titles (id, title, type, overview, release_year, maturity_rating, match_score, resolution, duration, poster_url, backdrop_url, trailer_url, director, cast_members, top_rank) VALUES
('m1', 'Stranger Things', 'SERIES', 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.', 2016, '16+', 98, '4K Ultra HD', '4 Seasons', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'The Duffer Brothers', 'Winona Ryder, David Harbour, Millie Bobby Brown', 1),
('m2', 'The Dark Knight', 'MOVIE', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, '16+', 99, '4K Ultra HD', '2h 32m', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'Christopher Nolan', 'Christian Bale, Heath Ledger, Aaron Eckhart', 2),
('m3', 'Inception', 'MOVIE', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2010, '13+', 96, '4K Ultra HD', '2h 28m', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page', 3),
('m4', 'Cyberpunk: Edgerunners', 'SERIES', 'A street kid trying to survive in a technology and body modification-obsessed city of the future loses everything and chooses to stay alive by becoming an edgerunner.', 2022, '18+', 97, '4K Ultra HD', '1 Season', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Hiroyuki Imaishi', 'KENN, Aoi Yuuki, Hiroki Touchi', 4),
('m5', 'Breaking Bad', 'SERIES', 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family’s future.', 2008, '18+', 99, '4K Ultra HD', '5 Seasons', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'Vince Gilligan', 'Bryan Cranston, Aaron Paul, Anna Gunn', 5),
('m6', 'Interstellar', 'MOVIE', 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.', 2014, '13+', 97, '4K Ultra HD', '2h 49m', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', 6);

-- Title-Genre Mappings
INSERT INTO title_genres (title_id, genre_id) VALUES
('m1', 'g-scifi'), ('m1', 'g-horror'), ('m1', 'g-drama'),
('m2', 'g-action'), ('m2', 'g-thriller'), ('m2', 'g-drama'),
('m3', 'g-scifi'), ('m3', 'g-action'), ('m3', 'g-thriller'),
('m4', 'g-scifi'), ('m4', 'g-action'),
('m5', 'g-drama'), ('m5', 'g-thriller'),
('m6', 'g-scifi'), ('m6', 'g-drama');

-- Seasons & Episodes for Stranger Things (m1)
INSERT INTO seasons (id, title_id, season_number, name) VALUES
('s1-m1', 'm1', 1, 'Season 1'),
('s2-m1', 'm1', 2, 'Season 2');

INSERT INTO episodes (id, season_id, episode_number, title, overview, duration_seconds, thumbnail_url, media_asset_id) VALUES
('e1-s1', 's1-m1', 1, 'Chapter One: The Vanishing of Will Byers', 'On his way home from a friend’s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.', 2880, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', NULL),
('e2-s1', 's1-m1', 2, 'Chapter Two: The Weirdo on Maple Street', 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions a shaken Joyce about a disturbing phone call.', 3300, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80', NULL);
