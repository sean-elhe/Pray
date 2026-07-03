CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE prayers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shared_prayers (
    id SERIAL PRIMARY KEY,
    prayer_id INTEGER NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
    shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission TEXT DEFAULT 'view',
    created_at TIMESTAMP DEFAULT NOW()
);