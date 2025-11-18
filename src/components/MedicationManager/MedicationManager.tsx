import React, { useState } from 'react';
import type { Medication, AppData } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon, TrashIcon, CheckIcon } from './common/Icons';
import TimePicker from './common/TimePicker';

interface MedicationManagerProps {
  medications: Medication[];
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const MedicationManager: React.FC<MedicationManagerProps> = ({ medications, setAppData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '08:00' });
  const [confirmUncheckId, setConfirmUncheckId] = useState<string | null>(null);
  const [confirmCheckId, setConfirmCheckId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [exitingItemIds, setExitingItemIds] = useState<Set<string>>(new Set());

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage) return;
    const medToAdd: Medication = { ...newMed, id: uuidv4(), taken: false };
    setAppData(prev => ({ ...prev, medications: [...prev.medications, medToAdd].sort((a,b) => a.time.localeCompare(b.time)) }));
    setNewMed({ name: '', dosage: '', time: '08:00' });
    setIsModalOpen(false);
  };
  
  const handleToggleTaken = (med: Medication) => {
    if (med.taken) {
      // If already taken, prompt for confirmation to uncheck
      setConfirmUncheckId(med.id);
    } else {
      // If not taken, prompt for confirmation to check
      setConfirmCheckId(med.id);
    }
  };

  const handleConfirmCheck = () => {
    if (confirmCheckId) {
      setAppData(prev => ({
        ...prev,
        medications: prev.medications.map(med => med.id === confirmCheckId ? { ...med, taken: true } : med)
      }));
      setConfirmCheckId(null);
    }
  };

  const handleConfirmUncheck = () => {
    if (confirmUncheckId) {
      setAppData(prev => ({
        ...prev,
        medications: prev.medications.map(med => med.id === confirmUncheckId ? { ...med, taken: false } : med)
      }));
      setConfirmUncheckId(null);
    }
  };

  const triggerDeleteAnimation = (id: string) => {
    setExitingItemIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setAppData(prev => ({ ...prev, medications: prev.medications.filter(med => med.id !== id) }));
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-bold text-neutral">Medication Schedule</h1>
        <Button onClick={() => setIsModalOpen(true)} Icon={PlusIcon}>Add New</Button>
      </div>

      <Card>
        {medications.length === 0 && exitingItemIds.size === 0 ? (
          <p className="text-center text-2xl py-10 text-gray-500">No medications scheduled. Add one to get started!</p>
        ) : (
          <ul className="space-y-6">
            {medications.map(med => (
              <li 
                key={med.id} 
                className={`flex items-center p-6 rounded-lg transition-all duration-300 ${med.taken ? 'bg-green-100/70' : 'bg-base-200'} ${exitingItemIds.has(med.id) ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}
              >
                <div className="flex items-center gap-6 flex-1">
                  <button 
                    onClick={() => handleToggleTaken(med)}
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors
                      ${med.taken ? 'bg-success border-green-600 text-white' : 'bg-white border-gray-300'}`}
                    aria-label={`Mark ${med.name} as ${med.taken ? 'not taken' : 'taken'}`}
                  >
                    {med.taken && <span className="w-8 h-8"><CheckIcon/></span>}
                  </button>
                  <div>
                    <p className={`font-bold text-2xl ${med.taken ? 'line-through text-gray-500' : 'text-neutral'}`}>{med.name}</p>
                    <p className="text-lg text-gray-600">{med.dosage}</p>
                  </div>
                </div>
                <p className={`text-3xl font-bold tabular-nums ${med.taken ? 'text-gray-500' : 'text-primary'}`}>{med.time}</p>
                <button onClick={() => setItemToDelete(med.id)} className="ml-8 p-3 rounded-full text-gray-400 hover:bg-red-100 hover:text-error" aria-label={`Delete ${med.name}`}>
                  <span className="w-8 h-8 block"><TrashIcon/></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Medication">
        <div className="space-y-6">
          <input type="text" placeholder="Medication Name" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-input-bg text-input-text placeholder-gray-400"/>
          <input type="text" placeholder="Dosage (e.g., 1 pill)" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-input-bg text-input-text placeholder-gray-400"/>
          <TimePicker value={newMed.time} onChange={time => setNewMed({...newMed, time})}/>
          <Button onClick={handleAddMedication} className="w-full">Add Medication</Button>
        </div>
      </Modal>

      <Modal isOpen={!!confirmCheckId} onClose={() => setConfirmCheckId(null)} title="Confirm Medication">
        <div className="space-y-8 text-center">
          <p className="text-3xl">Are you sure you have taken this medication?</p>
          <div className="flex justify-center gap-6">
              <Button onClick={handleConfirmCheck} variant="primary">
                  Yes, Taken
              </Button>
              <Button onClick={() => setConfirmCheckId(null)} variant="ghost">
                  Cancel
              </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!confirmUncheckId} onClose={() => setConfirmUncheckId(null)} title="Are you sure?">
        <div className="space-y-8 text-center">
          <p className="text-3xl">Do you want to mark this medication as not taken?</p>
          <div className="flex justify-center gap-6">
              <Button onClick={handleConfirmUncheck} variant="danger">
                  Yes, Uncheck
              </Button>
              <Button onClick={() => setConfirmUncheckId(null)} variant="ghost">
                  Cancel
              </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Confirm Deletion">
        <div className="space-y-8 text-center">
          <p className="text-3xl">Are you sure you want to delete this medication?</p>
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

export default MedicationManager;