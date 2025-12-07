// src/pages/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { authService } from '../services/authService';

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchDoctors();
    fetchMyAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/users/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailability = async (doctorId) => {
    try {
      const response = await api.get(`/availability/search?doctorId=${doctorId}`);
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const response = await api.get(`/appointments/patient/${user.id}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const bookAppointment = async (availabilityId) => {
    try {
      await api.post('/appointments', {
        patientId: user.id,
        doctorId: selectedDoctor,
        availabilityId: availabilityId,
      });
      alert('Appointment booked successfully!');
      fetchMyAppointments();
      setAvailability([]);
    } catch (error) {
      alert('Booking failed: ' + error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      alert('Appointment cancelled!');
      fetchMyAppointments();
    } catch (error) {
      alert('Cancellation failed: ' + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      <p className="mb-4">Welcome, {user.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Doctors */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Search Doctors</h2>
          <div className="space-y-2">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border p-3 rounded hover:bg-gray-50">
                <p className="font-semibold">{doctor.name}</p>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <button
                  onClick={() => {
                    setSelectedDoctor(doctor.id);
                    fetchAvailability(doctor.id);
                  }}
                  className="mt-2 bg-blue-500 text-white px-4 py-1 rounded text-sm"
                >
                  View Availability
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Available Slots</h2>
          {availability.length > 0 ? (
            <div className="space-y-2">
              {availability.map((slot) => (
                <div key={slot.id} className="border p-3 rounded">
                  <p>{slot.date} | {slot.start_time} - {slot.end_time}</p>
                  <button
                    onClick={() => bookAppointment(slot.id)}
                    className="mt-2 bg-green-500 text-white px-4 py-1 rounded text-sm"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Select a doctor to view availability</p>
          )}
        </div>

        {/* My Appointments */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <h2 className="text-xl font-bold mb-4">My Appointments</h2>
          {appointments.length > 0 ? (
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div key={appt.id} className="border p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Dr. {appt.doctor_name}</p>
                    <p className="text-sm">{appt.date} | {appt.start_time}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <button
                    onClick={() => cancelAppointment(appt.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;