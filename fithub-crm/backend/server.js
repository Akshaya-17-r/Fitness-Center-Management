const express = require('express');
const cors = require('cors');
const path = require('path');

const membersRouter = require('./routes/members');
const trainersRouter = require('./routes/trainers');
const classesRouter = require('./routes/classes');
const paymentsRouter = require('./routes/payments');
const notificationsRouter = require('./routes/notifications');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/members', membersRouter);
app.use('/api/trainers', trainersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/reports', reportsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'FitHub CRM API',
    version: '1.0.0'
  });
});

// Dashboard summary endpoint
app.get('/api/dashboard', (req, res) => {
  const members = require('./data/members.json');
  const payments = require('./data/payments.json');
  const classes = require('./data/classes.json');

  const today = new Date().toISOString().slice(0, 10);
  const in7Days = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const activeMembers = members.filter(m => m.status === 'Active').length;
  const expiringMembers = members.filter(m => m.expiry >= today && m.expiry <= in7Days).length;
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const todayClasses = classes.filter(c => c.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length;

  res.json({
    activeMembers,
    expiringMembers,
    totalRevenue,
    todayClasses,
    totalMembers: members.length,
    totalTrainers: require('./data/trainers.json').length
  });
});

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🏋️  FitHub CRM Server running on http://localhost:${PORT}`);
  console.log(`📊  API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐  Frontend: http://localhost:${PORT}\n`);
});

module.exports = app;
