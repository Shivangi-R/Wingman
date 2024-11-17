CREATE TABLE comments(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    comment VARCHAR(1000) NOT NULL,
    author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
    anonymous BOOLEAN DEFAULT FALSE,
    ratings BIGINT DEFAULT 0,
    postId BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    edited BOOLEAN DEFAULT FALSE,
    timestamp VARCHAR(50) NOT NULL
);

