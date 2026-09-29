CREATE DATABASE IF NOT EXISTS store_rating_db;

USE store_rating_db;


CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    address VARCHAR(400) NOT NULL,

    role ENUM(
        'ADMIN',
        'USER',
        'STORE_OWNER'
    ) NOT NULL DEFAULT 'USER',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_name_length
        CHECK (CHAR_LENGTH(name) BETWEEN 20 AND 60),

    CONSTRAINT chk_user_address_length
        CHECK (CHAR_LENGTH(address) <= 400)
);



CREATE TABLE IF NOT EXISTS stores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL,

    address VARCHAR(400) NOT NULL,

    owner_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_store_address_length
        CHECK (CHAR_LENGTH(address) <= 400)
);




CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    store_id BIGINT UNSIGNED NOT NULL,

    rating TINYINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_rating_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_rating_store
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_rating_value
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT unique_user_store_rating
        UNIQUE (user_id, store_id)
);



CREATE INDEX idx_users_name
ON users(name);

CREATE INDEX idx_users_role
ON users(role);

CREATE INDEX idx_users_address
ON users(address);

CREATE INDEX idx_stores_name
ON stores(name);

CREATE INDEX idx_stores_address
ON stores(address);

CREATE INDEX idx_stores_owner
ON stores(owner_id);

CREATE INDEX idx_ratings_user
ON ratings(user_id);

CREATE INDEX idx_ratings_store
ON ratings(store_id);