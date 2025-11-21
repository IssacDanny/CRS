/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create a new ENUM type for the days of the week
  pgm.createType('day_of_week_enum', ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

  // Add the new columns to the 'courses' table
  pgm.addColumns('courses', {
    day_of_week: { type: 'day_of_week_enum', notNull: true, default: 'MONDAY' },
    start_time: { type: 'TIME', notNull: true, default: '00:00:00' },
    end_time: { type: 'TIME', notNull: true, default: '00:00:00' },
  });
};

exports.down = (pgm) => {
  // To reverse the migration, drop the columns first
  pgm.dropColumns('courses', ['day_of_week', 'start_time', 'end_time']);

  // Then drop the ENUM type
  pgm.dropType('day_of_week_enum');
};