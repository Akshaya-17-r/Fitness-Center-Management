const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const read = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, `../data/${file}.json`), 'utf8'));

// GET full report summary
router.get('/summary', (req, res) => {
  try {
    const members = read('members');
    const payments = read('payments');
    const classes = read('classes');
    const trainers = read('trainers');

    const today = new Date().toISOString().slice(0, 10);
    const active = members.filter(m => m.status === 'Active');
    const expired = members.filter(m => m.status === 'Expired');
    const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

    res.json({
      success: true,
      data: {
        members: { total: members.length, active: active.length, expired: expired.length },
        revenue: { total: totalRevenue, pending },
        classes: { total: classes.length, avgEnrolled: Math.round(classes.reduce((s,c) => s + c.enrolled, 0) / classes.length) },
        trainers: { total: trainers.length, avgRating: (trainers.reduce((s,t) => s + t.rating, 0) / trainers.length).toFixed(1) },
        planBreakdown: {
          Premium: members.filter(m => m.plan === 'Premium').length,
          Standard: members.filter(m => m.plan === 'Standard').length,
          Basic: members.filter(m => m.plan === 'Basic').length
        },
        classTypeBreakdown: {
          hiit: classes.filter(c => c.type === 'hiit').length,
          yoga: classes.filter(c => c.type === 'yoga').length,
          spin: classes.filter(c => c.type === 'spin').length,
          pilates: classes.filter(c => c.type === 'pilates').length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET monthly revenue trend (mock)
router.get('/revenue-trend', (req, res) => {
  res.json({
    success: true,
    data: [
      { month: 'Oct 2025', revenue: 310000 },
      { month: 'Nov 2025', revenue: 325000 },
      { month: 'Dec 2025', revenue: 348000 },
      { month: 'Jan 2026', revenue: 362000 },
      { month: 'Feb 2026', revenue: 375000 },
      { month: 'Mar 2026', revenue: 374600 },
      { month: 'Apr 2026', revenue: 421800 }
    ]
  });
});

// GET membership growth trend (mock)
router.get('/growth-trend', (req, res) => {
  res.json({
    success: true,
    data: [
      { month: 'Oct 2025', members: 980 },
      { month: 'Nov 2025', members: 1032 },
      { month: 'Dec 2025', members: 1085 },
      { month: 'Jan 2026', members: 1140 },
      { month: 'Feb 2026', members: 1198 },
      { month: 'Mar 2026', members: 1242 },
      { month: 'Apr 2026', members: 1284 }
    ]
  });
});

module.exports = router;
