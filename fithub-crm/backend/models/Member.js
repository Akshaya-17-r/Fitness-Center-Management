/**
 * Member Model — Data validation & business logic
 * Mirrors Salesforce object structure for FitHub CRM
 */

const PLANS = ['Premium', 'Standard', 'Basic'];
const STATUSES = ['Active', 'Expiring', 'Expired'];
const PLAN_DURATIONS = { Premium: 12, Standard: 6, Basic: 3 };
const PLAN_PRICES = { Premium: 5000, Standard: 3500, Basic: 1800 };

/**
 * Validate member input fields
 * @param {Object} data - raw request body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateMember(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Valid email is required');
  if (!data.plan || !PLANS.includes(data.plan)) errors.push(`Plan must be one of: ${PLANS.join(', ')}`);
  if (data.phone && !/^\+?[\d\s\-]{7,15}$/.test(data.phone)) errors.push('Invalid phone format');
  return { valid: errors.length === 0, errors };
}

/**
 * Compute expiry date based on plan and join date
 */
function computeExpiry(plan, joinDate) {
  const date = new Date(joinDate || Date.now());
  date.setMonth(date.getMonth() + (PLAN_DURATIONS[plan] || 3));
  return date.toISOString().slice(0, 10);
}

/**
 * Determine member status based on expiry date
 */
function computeStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.floor((expiry - today) / 86400000);
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= 7) return 'Expiring';
  return 'Active';
}

/**
 * Get plan price
 */
function getPlanPrice(plan) {
  return PLAN_PRICES[plan] || 0;
}

module.exports = { validateMember, computeExpiry, computeStatus, getPlanPrice, PLANS, STATUSES, PLAN_PRICES };
