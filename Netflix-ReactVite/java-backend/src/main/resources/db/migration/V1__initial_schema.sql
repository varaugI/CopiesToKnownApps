-- StreamFlix Initial Schema Migration V1
-- PostgreSQL DDL Script

CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_email ON accounts(email);

CREATE TABLE profiles (
    id VARCHAR(36) PRIMARY KEY,
    account_id VARCHAR(36) NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) NOT NULL,
    color_hex VARCHAR(20) NOT NULL DEFAULT '#E50914',
    is_kids BOOLEAN NOT NULL DEFAULT FALSE,
    maturity_rating VARCHAR(20) NOT NULL DEFAULT '18+',
    pin_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_account_profile_name UNIQUE (account_id, name)
);

CREATE INDEX idx_profiles_account_id ON profiles(account_id);

CREATE TABLE genres (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE titles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    overview TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    maturity_rating VARCHAR(20) NOT NULL,
    match_score INTEGER NOT NULL DEFAULT 95,
    resolution VARCHAR(50) NOT NULL DEFAULT '4K Ultra HD',
    duration VARCHAR(50),
    poster_url VARCHAR(500),
    backdrop_url VARCHAR(500),
    trailer_url VARCHAR(500),
    director VARCHAR(255),
    cast_members TEXT,
    top_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_titles_type ON titles(type);
CREATE INDEX idx_titles_release_year ON titles(release_year);

CREATE TABLE title_genres (
    title_id VARCHAR(36) NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    genre_id VARCHAR(36) NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (title_id, genre_id)
);

CREATE TABLE seasons (
    id VARCHAR(36) PRIMARY KEY,
    title_id VARCHAR(36) NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_title_season UNIQUE (title_id, season_number)
);

CREATE TABLE episodes (
    id VARCHAR(36) PRIMARY KEY,
    season_id VARCHAR(36) NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    duration_seconds INTEGER NOT NULL,
    thumbnail_url VARCHAR(500),
    media_asset_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_season_episode UNIQUE (season_id, episode_number)
);

CREATE TABLE media_assets (
    id VARCHAR(36) PRIMARY KEY,
    title_id VARCHAR(36) NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    object_key VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    hls_master_url VARCHAR(500),
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE my_list_entries (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title_id VARCHAR(36) NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_profile_title_mylist UNIQUE (profile_id, title_id)
);

CREATE INDEX idx_mylist_profile_id ON my_list_entries(profile_id);

CREATE TABLE watch_progress (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title_id VARCHAR(36) NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    episode_id VARCHAR(36) REFERENCES episodes(id) ON DELETE SET NULL,
    progress_seconds INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_profile_title_progress UNIQUE (profile_id, title_id)
);

CREATE INDEX idx_watch_progress_profile ON watch_progress(profile_id);

CREATE TABLE watch_party_rooms (
    id VARCHAR(36) PRIMARY KEY,
    room_code VARCHAR(10) NOT NULL UNIQUE,
    host_profile_id VARCHAR(36) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title_id VARCHAR(36) NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    is_playing BOOLEAN NOT NULL DEFAULT FALSE,
    current_time_seconds DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_watch_party_code ON watch_party_rooms(room_code);

CREATE TABLE watch_party_messages (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL REFERENCES watch_party_rooms(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outbox_events (
    id VARCHAR(36) PRIMARY KEY,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_outbox_status ON outbox_events(status);
