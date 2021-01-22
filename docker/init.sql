CREATE TABLE IF NOT EXISTS Url (
    id        int PRIMARY KEY AUTO_INCREMENT,
    hash     varchar(255) UNIQUE NOT NULL,
    url  varchar(255) NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP,
    deletedAt datetime     NULL
);

CREATE TABLE IF NOT EXISTS Visitor (
    id          int PRIMARY KEY AUTO_INCREMENT,
    country     varchar(255)    NULL,
    city        varchar(255)    NULL,
    ipHash      varchar(255)    NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP,
    deletedAt datetime     NULL
);

CREATE TABLE IF NOT EXISTS Stats (
     id        int PRIMARY KEY AUTO_INCREMENT,
     urlId     int         NOT NULL,
     visitorId int         NOT NULL,
     createdAt datetime DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime ON UPDATE CURRENT_TIMESTAMP,
    deletedAt datetime     NULL,
    FOREIGN KEY (urlId) REFERENCES Url (id),
    FOREIGN KEY (visitorId) REFERENCES Visitor (id)
);