const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/classes.json');
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all classes
router.get('/', (req, res) => {
  try {
    let classes = readData();
    const { day, type, trainer } = req.query;
    if (day) classes = classes.filter(c => c.day.toLowerCase() === day.toLowerCase());
    if (type) classes = classes.filter(c => c.type === type);
    if (trainer) classes = classes.filter(c => c.trainer.toLowerCase().includes(trainer.toLowerCase()));
    res.json({ success: true, count: classes.length, data: classes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single class
router.get('/:id', (req, res) => {
  try {
    const classes = readData();
    const cls = classes.find(c => c.id === req.params.id);
    if (!cls) return res.status(404).json({ success: false, error: 'Class not found' });
    res.json({ success: true, data: cls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create class
router.post('/', (req, res) => {
  try {
    const classes = readData();
    const { name, type, day, time, trainer, capacity } = req.body;
    if (!name || !day || !time) return res.status(400).json({ success: false, error: 'name, day, and time are required' });

    const newClass = {
      id: 'C' + String(classes.length + 1).padStart(3, '0'),
      name, type: type || 'general', day, time,
      trainer: trainer || 'Unassigned',
      capacity: capacity || 30,
      enrolled: 0
    };
    classes.push(newClass);
    writeData(classes);
    res.status(201).json({ success: true, data: newClass });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update class
router.put('/:id', (req, res) => {
  try {
    const classes = readData();
    const idx = classes.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Class not found' });
    classes[idx] = { ...classes[idx], ...req.body, id: classes[idx].id };
    writeData(classes);
    res.json({ success: true, data: classes[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE class
router.delete('/:id', (req, res) => {
  try {
    let classes = readData();
    const exists = classes.find(c => c.id === req.params.id);
    if (!exists) return res.status(404).json({ success: false, error: 'Class not found' });
    classes = classes.filter(c => c.id !== req.params.id);
    writeData(classes);
    res.json({ success: true, message: `Class ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET schedule grouped by day
router.get('/schedule/weekly', (req, res) => {
  try {
    const classes = readData();
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const schedule = {};
    days.forEach(d => { schedule[d] = classes.filter(c => c.day === d); });
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
