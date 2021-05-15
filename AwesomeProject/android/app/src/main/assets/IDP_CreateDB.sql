-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2021-05-15 08:52:41.444

-- tables
-- Table: air 
CREATE TABLE air  (
    time datetime NOT NULL,
    value integer NOT NULL,
    PRIMARY KEY(time)
);

-- Table: light
CREATE TABLE light (
    time datetime NOT NULL ,
    value integer NOT NULL,
    PRIMARY KEY(time)
);

-- Table: plant
CREATE TABLE plant (
    plant_id integer NOT NULL,
    max_air_humidity integer NOT NULL,
    max_soil_humidity integer NOT NULL,
    min_soil_humidity integer NOT NULL,
    min_air_humidity integer NOT NULL,
    max_temperature integer NOT NULL,
    min_temperature integer NOT NULL,
    user_user_id integer NOT NULL,
    PRIMARY KEY (plant_id)
);

-- Table: sensor
CREATE TABLE sensor (
    id integer NOT NULL ,
    name varchar(100) NOT NULL,
    online boolean NOT NULL,
    user_user_id integer NOT NULL,
    PRIMARY KEY (id)
);

-- Table: soil
CREATE TABLE soil (
    time datetime NOT NULL,
    value integer NOT NULL,
    PRIMARY KEY (time)
);

-- Table: temperature
CREATE TABLE temperature (
    time datetime NOT NULL,
    value integer NOT NULL,
    PRIMARY KEY (time)

);

-- Table: user
CREATE TABLE user (
    user_id integer NOT NULL,
    username varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    phone_number varchar(10),
    email varchar(100) NOT NULL,
    PRIMARY KEY (user_id)
);

-- End of file.