/**
 * Class Model — Scheduling & capacity validation
 * Manages class slots, types, and enrollment for FitHub CRM
 */

const CLASS_TYPES = ['hiit', 'yoga', 'spin', 'pilates', 'strength', 'boxing', 'barre', 'general'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_CAPACITY = 30;

/**
 * Validate class input
 */
function validateClass(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) errors.push('Class name is required');
  if (!data.day || !DAYS.includes(data.day)) errors.push(`Day must be one of: ${DAYS.join(', ')}`);
  if (!data.time) errors.push('Time is required');
  if (data.type && !CLASS_TYPES.includes(data.type.toLowerCase())) errors.push(`Type must be one of: ${CLASS_TYPES.join(', ')}`);
  if (data.capacity && (isNaN(data.capacity) || data.capacity < 1)) errors.push('Capacity must be a positive number');
  return { valid: errors.length === 0, errors };
}

/**
 * Check if a class has open slots
 */
function hasCapacity(cls) {
  return cls.enrolled < cls.capacity;
}

/**
 * Get fill percentage
 */
function getFillRate(cls) {
  return Math.round((cls.enrolled / cls.capacity) * 100);
}

/**
 * Get class status label
 */
function getStatus(cls) {
  const rate = getFillRate(cls);
  if (rate >= 100) return 'Full';
  if (rate >= 80) return 'Almost Full';
  return 'Open';
}

/**
 * Group classes by day for schedule view
 */
function groupByDay(classes) {
  const schedule = {};
  DAYS.forEach(d => { schedule[d] = []; });
  classes.forEach(c => {
    if (schedule[c.day]) schedule[c.day].push(c);
  });
  return schedule;
}

module.exports = { validateClass, hasCapacity, getFillRate, getStatus, groupByDay, CLASS_TYPES, DAYS, DEFAULT_CAPACITY };
