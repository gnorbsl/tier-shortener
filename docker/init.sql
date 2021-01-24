CREATE TABLE IF NOT EXISTS Url (
    id        int PRIMARY KEY AUTO_INCREMENT,
    hash      varchar(255) UNIQUE NOT NULL,
    url       varchar(2048) NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP,
    deletedAt datetime     NULL
);

CREATE TABLE IF NOT EXISTS Stats (
    id          int PRIMARY KEY AUTO_INCREMENT,
    ipHash      varchar(255) NOT NULL,
    urlId       int NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP,
    deletedAt datetime     NULL,
    FOREIGN KEY (urlId) REFERENCES Url (id) ON DELETE CASCADE
);
