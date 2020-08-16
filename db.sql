CREATE DATABASE vitalscope;

--CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE groups
(
    groupName VARCHAR(250) PRIMARY KEY NOT NULL,
    groupCode VARCHAR(250) NOT NULL
);

CREATE TABLE patients
(
    patientId uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid() NOT NULL,
    FName VARCHAR(250) NOT NULL,
    LName VARCHAR(250) NOT NULL,
    groupName VARCHAR(250) REFERENCES groups(groupName) NOT NULL
);

CREATE TABLE datapoints
(
    dataId uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid() NOT NULL,
    dataDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    heartRate INT NOT NULL,
    respRate INT NOT NULL,
    spo2 INT,
    pefr INT,
    groupName VARCHAR(250) REFERENCES groups(groupName) NOT NULL,
    patientId uuid REFERENCES patients(patientId) NOT NULL
);

