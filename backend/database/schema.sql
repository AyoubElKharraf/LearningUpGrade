CREATE DATABASE IF NOT EXISTS learnspark CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE learnspark;

CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(80) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(1024) NOT NULL,
  category VARCHAR(100) NOT NULL,
  lessons_count INT NOT NULL,
  duration VARCHAR(50) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  students INT NOT NULL,
  progress INT NULL,
  color VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(80) PRIMARY KEY,
  course_id VARCHAR(80) NOT NULL,
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  video_url VARCHAR(1024) NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  type ENUM('video','quiz','reading') NOT NULL,
  position INT NOT NULL,
  CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT PRIMARY KEY,
  question TEXT NOT NULL,
  options_json JSON NOT NULL,
  correct_answer INT NOT NULL,
  explanation TEXT NOT NULL
);

-- Authentication persistence (admin/client)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(80) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','client') NOT NULL DEFAULT 'client',
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

