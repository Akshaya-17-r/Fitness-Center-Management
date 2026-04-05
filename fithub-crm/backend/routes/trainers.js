const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/trainers.json');
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all trainers
router.get('/', (req, res) => {
  try {
    let trainers = readData();
    const { avail, spec } = req.query;
    if (avail) trainers = trainers.filter(t => t.avail === avail);
    if (spec) trainers = trainers.filter(t => t.spec.toLowerCase().includes(spec.toLowerCase()));
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single trainer
router.get('/:id', (req, res) => {
  try {
    const trainers = readData();
    const trainer = trainers.find(t => t.id === req.params.id);
    if (!trainer) return res.status(404).json({ success: false, error: 'Trainer not found' });
    res.json({ success: true, data: trainer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create trainer
router.post('/', (req, res) => {
  try {
    const trainers = readData();
    const { name, email, phone, spec, avail, experience } = req.body;
    if (!name || !spec) return res.status(400).json({ success: false, error: 'name and spec are required' });

    const newTrainer = {
      id: 'T' + String(trainers.length + 1).padStart(3, '0'),
      name, email: email || '',
      phone: phone || '',
      spec, avail: avail || 'Full Time',
      members: 0, classes: 0, rating: 0,
      experience: experience || 'N/A'
    };
    trainers.push(newTrainer);
    writeData(trainers);
    res.status(201).json({ success: true, data: newTrainer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update trainer
router.put('/:id', (req, res) => {
  try {
    const trainers = readData();
    const idx = trainers.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Trainer not found' });
    trainers[idx] = { ...trainers[idx], ...req.body, id: trainers[idx].id };
    writeData(trainers);
    res.json({ success: true, data: trainers[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE trainer
router.delete('/:id', (req, res) => {
  try {
    let trainers = readData();
    const exists = trainers.find(t => t.id === req.params.id);
    if (!exists) return res.status(404).json({ success: false, error: 'Trainer not found' });
    trainers = trainers.filter(t => t.id !== req.params.id);
    writeData(trainers);
    res.json({ success: true, message: `Trainer ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
