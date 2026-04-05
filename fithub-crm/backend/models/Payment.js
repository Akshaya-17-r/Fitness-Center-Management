/**
 * Payment Model — Validation & processing logic
 * Handles subscription billing, payment validation for FitHub CRM
 */

const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Net Banking'];
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Overdue'];
const PLAN_PRICES = { Premium: 5000, Standard: 3500, Basic: 1800 };

/**
 * Validate payment input
 */
function validatePayment(data) {
  const errors = [];
  if (!data.member || data.member.trim().length < 2) errors.push('Member name is required');
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) errors.push('Valid amount is required');
  if (data.method && !PAYMENT_METHODS.includes(data.method)) errors.push(`Method must be one of: ${PAYMENT_METHODS.join(', ')}`);
  if (data.status && !PAYMENT_STATUSES.includes(data.status)) errors.push(`Status must be one of: ${PAYMENT_STATUSES.join(', ')}`);
  return { valid: errors.length === 0, errors };
}

/**
 * Compute total revenue from payments array
 */
function computeRevenue(payments) {
  const paid = payments.filter(p => p.status === 'Paid');
  const pending = payments.filter(p => p.status === 'Pending');
  const overdue = payments.filter(p => p.status === 'Overdue');
  return {
    total: paid.reduce((s, p) => s + Number(p.amount), 0),
    pending: pending.reduce((s, p) => s + Number(p.amount), 0),
    overdue: overdue.reduce((s, p) => s + Number(p.amount), 0),
    paidCount: paid.length,
    pendingCount: pending.length,
    overdueCount: overdue.length
  };
}

/**
 * Get expected amount for a plan
 */
function getPlanAmount(plan) {
  return PLAN_PRICES[plan] || 0;
}

/**
 * Check if a payment is overdue based on membership expiry
 */
function isOverdue(expiryDate) {
  return new Date(expiryDate) < new Date();
}

module.exports = { validatePayment, computeRevenue, getPlanAmount, isOverdue, PAYMENT_METHODS, PAYMENT_STATUSES, PLAN_PRICES };
