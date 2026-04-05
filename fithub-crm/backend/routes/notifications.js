const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/notifications.json');
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all notifications
router.get('/', (req, res) => {
  try {
    let notifs = readData();
    if (req.query.unread === 'true') notifs = notifs.filter(n => !n.read);
    res.json({ success: true, unreadCount: notifs.filter(n => !n.read).length, data: notifs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create notification
router.post('/', (req, res) => {
  try {
    const notifs = readData();
    const { msg, type } = req.body;
    if (!msg) return res.status(400).json({ success: false, error: 'msg is required' });
    const newNotif = {
      id: 'N' + String(notifs.length + 1).padStart(3, '0'),
      msg, time: 'Just now',
      read: false, type: type || 'info'
    };
    notifs.unshift(newNotif);
    writeData(notifs);
    res.status(201).json({ success: true, data: newNotif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT mark as read
router.put('/:id/read', (req, res) => {
  try {
    const notifs = readData();
    const idx = notifs.findIndex(n => n.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Notification not found' });
    notifs[idx].read = true;
    writeData(notifs);
    res.json({ success: true, data: notifs[idx] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT mark ALL as read
router.put('/mark/all-read', (req, res) => {
  try {
    const notifs = readData();
    notifs.forEach(n => n.read = true);
    writeData(notifs);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
