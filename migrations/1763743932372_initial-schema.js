/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // 1. Create an ENUM type for user roles for data integrity
  pgm.createType('user_role', ['STUDENT', 'ACADEMIC_OFFICE', 'ADMIN']);

  // 2. Create the users table
  pgm.createTable('users', {
    id: 'id', // Same as SERIAL PRIMARY KEY
    username: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    full_name: { type: 'varchar(255)', notNull: true },
    role: { type: 'user_role', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // 3. Create the courses table
  pgm.createTable('courses', {
    id: 'id',
    course_code: { type: 'varchar(20)', notNull: true, unique: true },
    course_name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    capacity: { type: 'integer', notNull: true },
    lecturer_name: { type: 'varchar(255)' },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // 4. Create the enrollments join table
  pgm.createTable('enrollments', {
    id: 'id',
    student_id: {
      type: 'integer',
      notNull: true,
      references: '"users"', // Foreign key to users table
      onDelete: 'CASCADE', // If a user is deleted, remove their enrollments
    },
    course_id: {
      type: 'integer',
      notNull: true,
      references: '"courses"', // Foreign key to courses table
      onDelete: 'CASCADE', // If a course is deleted, remove its enrollments
    },
    enrollment_date: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // 5. Add a unique constraint to prevent duplicate enrollments
  pgm.addConstraint('enrollments', 'unique_student_course', {
    unique: ['student_id', 'course_id'],
  });
};

exports.down = (pgm) => {
  // Drop tables in reverse order of creation to avoid foreign key errors
  pgm.dropTable('enrollments');
  pgm.dropTable('courses');
  pgm.dropTable('users');
  pgm.dropType('user_role');
};