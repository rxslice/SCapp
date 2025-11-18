import React, { useState } from 'react';
import type { Appointment, AppData } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon, TrashIcon } from './common/Icons';
import TimePicker from './common/TimePicker';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointments, setAppData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ title: '', date: '', time: '09:00', location: '', notes: '' });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [exitingItemIds, setExitingItemIds] = useState<Set<string>>(new Set());

  const handleAddAppointment = () => {
    if (!newAppt.title || !newAppt.date || !newAppt.time) return;
    const apptToAdd: Appointment = { ...newAppt, id: uuidv4() };
    setAppData(prev => ({
      ...prev,
      appointments: [...prev.appointments, apptToAdd].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }));
    setNewAppt({ title: '', date: '', time: '09:00', location: '', notes: '' });
    setIsModalOpen(false);
  };

  const triggerDeleteAnimation = (id: string) => {
    setExitingItemIds(prev => new Set(prev).add(id));
    setTimeout(() => {
        setAppData(prev => ({ ...prev, appointments: prev.appointments.filter(appt => appt.id !== id) }));
        setExitingItemIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }, 500); // Animation duration
  };
  
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      triggerDeleteAnimation(itemToDelete);
    }
    setItemToDelete(null);
  };

  const sortedAppointments = [...appointments].sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-bold text-neutral">Appointments</h1>
        <Button onClick={() => setIsModalOpen(true)} Icon={PlusIcon} variant="secondary">Add New</Button>
      </div>

      <Card>
        {appointments.length === 0 && exitingItemIds.size === 0 ? (
          <p className="text-center text-2xl py-10 text-gray-500">No appointments scheduled. Add one to get started!</p>
        ) : (
          <ul className="space-y-8">
            {sortedAppointments.map(appt => (
              <li 
                key={appt.id} 
                className={`bg-base-200 p-8 rounded-lg flex gap-8 ${exitingItemIds.has(appt.id) ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}
              >
                <div className="text-center border-r-2 border-secondary/20 pr-8">
                  <p className="text-2xl font-bold text-secondary">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                  <p className="text-6xl font-extrabold text-neutral">{new Date(appt.date).getDate()}</p>
                   <p className="text-2xl font-semibold text-secondary tabular-nums">{appt.time}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold">{appt.title}</h3>
                  <p className="text-xl text-gray-600">{appt.location}</p>
                  <p className="text-lg mt-3 text-gray-500">{appt.notes}</p>
                </div>
                <button onClick={() => setItemToDelete(appt.id)} className="p-3 self-start rounded-full text-gray-400 hover:bg-red-100 hover:text-error" aria-label={`Delete appointment: ${appt.title}`}>
                  <span className="w-8 h-8 block"><TrashIcon /></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Appointment">
        <div className="space-y-5">
          <input type="text" placeholder="Appointment Title" value={newAppt.title} onChange={e => setNewAppt({...newAppt, title: e.target.value})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none bg-input-bg text-input-text placeholder-gray-400"/>
          <input type="date" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none bg-input-bg text-input-text placeholder-gray-400"/>
          <TimePicker value={newAppt.time} onChange={time => setNewAppt({...newAppt, time})}/>
          <input type="text" placeholder="Location" value={newAppt.location} onChange={e => setNewAppt({...newAppt, location: e.target.value})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none bg-input-bg text-input-text placeholder-gray-400"/>
          <textarea placeholder="Notes" value={newAppt.notes} onChange={e => setNewAppt({...newAppt, notes: e.target.value})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none h-28 bg-input-bg text-input-text placeholder-gray-400"/>
          <Button onClick={handleAddAppointment} variant="secondary" className="w-full">Add Appointment</Button>
        </div>
      </Modal>

      <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Confirm Deletion">
        <div className="space-y-8 text-center">
          <p className="text-3xl">Are you sure you want to delete this appointment?</p>
          <div className="flex justify-center gap-6">
              <Button onClick={handleConfirmDelete} variant="danger">
                  Yes, Delete
              </Button>
              <Button onClick={() => setItemToDelete(null)} variant="ghost">
                  Cancel
              </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentCalendar;