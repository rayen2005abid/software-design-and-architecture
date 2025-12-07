// backend/routes/appointments.js
const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Book appointment
router.post('/', authMiddleware, async (req, res) => {
  const { patientId, doctorId, availabilityId } = req.body;

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Check if slot is available
    const slotCheck = await client.query(
      'SELECT * FROM availability WHERE id = $1 AND is_booked = false FOR UPDATE',
      [availabilityId]
    );

    if (slotCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Slot not available' });
    }

    // Create appointment
    const appointment = await client.query(
      'INSERT INTO appointments (patient_id, doctor_id, availability_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [patientId, doctorId, availabilityId, 'confirmed']
    );

    // Mark slot as booked
    await client.query(
      'UPDATE availability SET is_booked = true WHERE id = $1',
      [availabilityId]
    );

    await client.query('COMMIT');
    res.status(201).json(appointment.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  } finally {
    client.release();
  }
});

// Get patient's appointments
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, av.date, av.start_time, av.end_time, u.name as doctor_name
       FROM appointments a
       JOIN availability av ON a.availability_id = av.id
       JOIN users u ON a.doctor_id = u.id
       WHERE a.patient_id = $1
       ORDER BY av.date DESC, av.start_time DESC`,
      [req.params.patientId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get doctor's appointments
router.get('/doctor/:doctorId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, av.date, av.start_time, av.end_time, u.name as patient_name
       FROM appointments a
       JOIN availability av ON a.availability_id = av.id
       JOIN users u ON a.patient_id = u.id
       WHERE a.doctor_id = $1
       ORDER BY av.date DESC, av.start_time DESC`,
      [req.params.doctorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Cancel appointment
router.delete('/:id', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Get appointment details
    const appt = await client.query(
      'SELECT availability_id FROM appointments WHERE id = $1',
      [req.params.id]
    );

    if (appt.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Delete appointment
    await client.query('DELETE FROM appointments WHERE id = $1', [req.params.id]);

    // Free up the slot
    await client.query(
      'UPDATE availability SET is_booked = false WHERE id = $1',
      [appt.rows[0].availability_id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  } finally {
    client.release();
  }
});

module.exports = router;