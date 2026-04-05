const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/payments.json');
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all payments
router.get('/', (req, res) => {
  try {
    let payments = readData();
    const { status, method, plan } = req.query;
    if (status) payments = payments.filter(p => p.status === status);
    if (method) payments = payments.filter(p => p.method === method);
    if (plan) payments = payments.filter(p => p.plan === plan);
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single payment
router.get('/:id', (req, res) => {
  try {
    const payments = readData();
    const payment = payments.find(p => p.id === req.params.id);
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST record payment
router.post('/', (req, res) => {
  try {
    const payments = readData();
    const { member, memberId, plan, amount, method, date, status } = req.body;
    if (!member || !amount) return res.status(400).json({ success: false, error: 'member and amount are required' });

    const newPayment = {
      id: 'PAY' + String(payments.length + 1).padStart(3, '0'),
      member, memberId: memberId || '',
      plan: plan || 'Standard',
      amount: parseFloat(amount),
      date: date || new Date().toISOString().slice(0, 10),
      method: method || 'UPI',
      status: status || 'Paid'
    };
    payments.unshift(newPayment);
    writeData(payments);
    res.status(201).json({ success: true, data: newPayment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update payment status
router.put('/:id', (req, res) => {
  try {
    const payments = readData();
    const idx = payments.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Payment not found' });
    payments[idx] = { ...payments[idx], ...req.body, id: payments[idx].id };
    writeData(payments);
    res.json({ success: true, data: payments[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET revenue summary
router.get('/summary/revenue', (req, res) => {
  try {
    const payments = readData();
    const paid = payments.filter(p => p.status === 'Paid');
    const pending = payments.filter(p => p.status === 'Pending');
    const overdue = payments.filter(p => p.status === 'Overdue');

    res.json({
      success: true,
      data: {
        totalRevenue: paid.reduce((s, p) => s + p.amount, 0),
        pendingAmount: pending.reduce((s, p) => s + p.amount, 0),
        overdueAmount: overdue.reduce((s, p) => s + p.amount, 0),
        totalTransactions: payments.length,
        paidCount: paid.length,
        pendingCount: pending.length,
        overdueCount: overdue.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
