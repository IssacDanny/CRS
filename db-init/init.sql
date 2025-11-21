-- db-init/init.sql

-- Drop existing tables to ensure a clean slate on every start (great for development)
DROP TABLE IF EXISTS "enrollments" CASCADE;
DROP TABLE IF EXISTS "courses" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TYPE IF EXISTS "user_role";
DROP TYPE IF EXISTS "day_of_week_enum";

-- Create an ENUM type for user roles for data integrity
CREATE TYPE "user_role" AS ENUM ('STUDENT', 'ACADEMIC_OFFICE', 'ADMIN');
CREATE TYPE "day_of_week_enum" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- Create the users table
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(100) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL,
  "full_name" VARCHAR(255) NOT NULL,
  "role" user_role NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the courses table
CREATE TABLE "courses" (
  "id" SERIAL PRIMARY KEY,
  "course_code" VARCHAR(20) NOT NULL UNIQUE,
  "course_name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "capacity" INTEGER NOT NULL,
  "lecturer_name" VARCHAR(255),
  "day_of_week" day_of_week_enum NOT NULL,
  "start_time" TIME NOT NULL,
  "end_time" TIME NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the enrollments join table
CREATE TABLE "enrollments" (
  "id" SERIAL PRIMARY KEY,
  "student_id" INTEGER NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  "course_id" INTEGER NOT NULL REFERENCES "courses"(id) ON DELETE CASCADE,
  "enrollment_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Add a unique constraint to prevent duplicate enrollments
  CONSTRAINT "unique_student_course" UNIQUE ("student_id", "course_id")
);

INSERT INTO users (username, password_hash, full_name, role)
VALUES ('superadmin', '$2b$10$kZZj7Bb17dk.coxYLqFqFu0KxjEMjVSUuRBh.6YiLAb.s6hueiOay', 'Super Admin', 'ADMIN');