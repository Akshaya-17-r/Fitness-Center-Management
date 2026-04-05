const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/members.json');

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all members (with optional filters)
router.get('/', (req, res) => {
  try {
    let members = readData();
    const { status, plan, search } = req.query;
    if (status) members = members.filter(m => m.status === status);
    if (plan) members = members.filter(m => m.plan === plan);
    if (search) {
      const q = search.toLowerCase();
      members = members.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: members.length, data: members });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single member
router.get('/:id', (req, res) => {
  try {
    const members = readData();
    const member = members.find(m => m.id === req.params.id);
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create member
router.post('/', (req, res) => {
  try {
    const members = readData();
    const { name, email, phone, plan, trainer, join } = req.body;

    if (!name || !email || !plan) {
      return res.status(400).json({ success: false, error: 'name, email, and plan are required' });
    }

    const joinDate = join || new Date().toISOString().slice(0, 10);
    const months = plan === 'Premium' ? 12 : plan === 'Standard' ? 6 : 3;
    const expDate = new Date(joinDate);
    expDate.setMonth(expDate.getMonth() + months);

    const newMember = {
      id: 'M' + String(members.length + 1).padStart(3, '0'),
      name, email,
      phone: phone || '',
      plan,
      join: joinDate,
      expiry: expDate.toISOString().slice(0, 10),
      status: 'Active',
      trainer: trainer || 'Unassigned'
    };

    members.unshift(newMember);
    writeData(members);
    res.status(201).json({ success: true, data: newMember });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update member
router.put('/:id', (req, res) => {
  try {
    const members = readData();
    const idx = members.findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Member not found' });

    members[idx] = { ...members[idx], ...req.body, id: members[idx].id };
    writeData(members);
    res.json({ success: true, data: members[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE member
router.delete('/:id', (req, res) => {
  try {
    let members = readData();
    const exists = members.find(m => m.id === req.params.id);
    if (!exists) return res.status(404).json({ success: false, error: 'Member not found' });

    members = members.filter(m => m.id !== req.params.id);
    writeData(members);
    res.json({ success: true, message: `Member ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET expiring members
router.get('/alerts/expiring', (req, res) => {
  try {
    const members = readData();
    const days = parseInt(req.query.days) || 7;
    const today = new Date().toISOString().slice(0, 10);
    const cutoff = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
    const expiring = members.filter(m => m.expiry >= today && m.expiry <= cutoff);
    res.json({ success: true, count: expiring.length, data: expiring });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
