/**
 * Trainer Model — Allocation & validation logic
 * Handles trainer specialization matching and availability
 */

const SPECIALIZATIONS = ['Yoga', 'HIIT', 'Pilates', 'Strength Training', 'Spin / Cycling', 'CrossFit', 'Boxing & MMA', 'Barre'];
const AVAILABILITY = ['Full Time', 'Part Time', 'Weekends Only'];

/**
 * Validate trainer data
 */
function validateTrainer(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!data.spec) errors.push('Specialization is required');
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');
  if (data.avail && !AVAILABILITY.includes(data.avail)) errors.push(`Availability must be: ${AVAILABILITY.join(', ')}`);
  return { valid: errors.length === 0, errors };
}

/**
 * Dynamically allocate trainer based on specialization and availability
 * @param {Array} trainers - all trainers
 * @param {string} classType - e.g. 'yoga', 'hiit'
 * @returns {Object|null} best matched trainer
 */
function allocateTrainer(trainers, classType) {
  const specMap = {
    yoga: ['Yoga'],
    hiit: ['HIIT', 'CrossFit'],
    pilates: ['Pilates', 'Barre'],
    spin: ['Spin / Cycling'],
    strength: ['Strength Training'],
    boxing: ['Boxing & MMA']
  };

  const preferred = specMap[classType?.toLowerCase()] || [];
  const available = trainers.filter(t => t.avail !== 'Weekends Only');

  const matched = available.filter(t => preferred.some(p => t.spec.includes(p)));
  if (matched.length === 0) return available[0] || null;

  // Pick trainer with fewest current classes (load balancing)
  return matched.sort((a, b) => a.classes - b.classes)[0];
}

module.exports = { validateTrainer, allocateTrainer, SPECIALIZATIONS, AVAILABILITY };
