// backend/routes/availability.js
const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Publish availability
router.post('/', authMiddleware, async (req, res) => {
  const { doctorId, date, startTime, endTime } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO availability (doctor_id, date, start_time, end_time, is_booked) VALUES ($1, $2, $3, $4, false) RETURNING *',
      [doctorId, date, startTime, endTime]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error publishing availability:', error);
    res.status(500).json({ error: 'Failed to publish availability' });
  }
});

// Search availability
router.get('/search', authMiddleware, async (req, res) => {
  const { doctorId, date } = req.query;

  try {
    let query = 'SELECT * FROM availability WHERE is_booked = false';
    const params = [];

    if (doctorId) {
      params.push(doctorId);
      query += ` AND doctor_id = $${params.length}`;
    }

    if (date) {
      params.push(date);
      query += ` AND date = $${params.length}`;
    }

    query += ' ORDER BY date, start_time';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching availability:', error);
    res.status(500).json({ error: 'Failed to search availability' });
  }
});

// Get doctor's availability
router.get('/doctor/:doctorId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM availability WHERE doctor_id = $1 ORDER BY date, start_time',
      [req.params.doctorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Delete availability
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM availability WHERE id = $1 AND is_booked = false', [req.params.id]);
    res.json({ message: 'Availability deleted' });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
});

module.exports = router;