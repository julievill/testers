CREATE DATABASE IF NOT EXISTS testerPlop;

-- Use the database
USE testerPlop;

CREATE TABLE newTables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    columns VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);