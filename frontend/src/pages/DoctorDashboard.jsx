// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { authService } from '../services/authService';

function DoctorDashboard() {
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newSlot, setNewSlot] = useState({
    date: '', startTime: '', endTime: ''
  });
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchMyAvailability();
    fetchMyAppointments();
  }, []);

  const fetchMyAvailability = async () => {
    try {
      const response = await api.get(`/availability/doctor/${user.id}`);
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const response = await api.get(`/appointments/doctor/${user.id}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const publishAvailability = async (e) => {
    e.preventDefault();
    try {
      await api.post('/availability', {
        doctorId: user.id,
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
      });
      alert('Availability published!');
      fetchMyAvailability();
      setNewSlot({ date: '', startTime: '', endTime: '' });
    } catch (error) {
      alert('Failed to publish: ' + error.message);
    }
  };

  const deleteAvailability = async (slotId) => {
    try {
      await api.delete(`/availability/${slotId}`);
      alert('Slot removed!');
      fetchMyAvailability();
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <p className="mb-4">Welcome, Dr. {user.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Publish Availability */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Publish Availability</h2>
          <form onSubmit={publishAvailability} className="space-y-3">
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={newSlot.date}
              onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
              required
            />
            <input
              type="time"
              className="w-full p-2 border rounded"
              placeholder="Start Time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
              required
            />
            <input
              type="time"
              className="w-full p-2 border rounded"
              placeholder="End Time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
              required
            />
            <button 
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Publish Slot
            </button>
          </form>
        </div>

        {/* My Availability */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">My Availability</h2>
          <div className="space-y-2">
            {availability.map((slot) => (
              <div key={slot.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p>{slot.date}</p>
                  <p className="text-sm text-gray-600">{slot.start_time} - {slot.end_time}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    slot.is_booked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {slot.is_booked ? 'Booked' : 'Available'}
                  </span>
                </div>
                {!slot.is_booked && (
                  <button
                    onClick={() => deleteAvailability(slot.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* My Schedule */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-4">My Schedule</h2>
          <div className="space-y-2">
            {appointments.map((appt) => (
              <div key={appt.id} className="border p-3 rounded">
                <p className="font-semibold">Patient: {appt.patient_name}</p>
                <p className="text-sm">{appt.date} | {appt.start_time} - {appt.end_time}</p>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;