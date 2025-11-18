import React, { useState } from 'react';
import type { Activity, AppData } from '../types';
import { ActivityType } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Modal from './common/Modal';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon, TrashIcon } from './common/Icons';

interface ActivityTrackerProps {
  activities: Activity[];
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({ activities, setAppData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: ActivityType.PHYSICAL, description: '', durationMinutes: 30 });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [exitingItemIds, setExitingItemIds] = useState<Set<string>>(new Set());

  const handleAddActivity = () => {
    if (!newActivity.description || newActivity.durationMinutes <= 0) return;
    const activityToAdd: Activity = { ...newActivity, id: uuidv4(), date: new Date().toISOString().split('T')[0] };
    setAppData(prev => ({
      ...prev,
      activities: [...prev.activities, activityToAdd].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
    setNewActivity({ type: ActivityType.PHYSICAL, description: '', durationMinutes: 30 });
    setIsModalOpen(false);
  };
  
  const triggerDeleteAnimation = (id: string) => {
    setExitingItemIds(prev => new Set(prev).add(id));
    setTimeout(() => {
        setAppData(prev => ({ ...prev, activities: prev.activities.filter(act => act.id !== id) }));
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

  const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-bold text-neutral">Activity Log</h1>
        <Button onClick={() => setIsModalOpen(true)} Icon={PlusIcon} className="bg-accent text-white hover:bg-pink-700">Log Activity</Button>
      </div>
      
      <Card>
        {activities.length === 0 && exitingItemIds.size === 0 ? (
          <p className="text-center text-2xl py-10 text-gray-500">No activities logged yet. Add one to get started!</p>
        ) : (
          <ul className="space-y-6">
            {sortedActivities.map(act => (
              <li 
                key={act.id} 
                className={`bg-base-200 p-6 rounded-lg flex items-center justify-between ${exitingItemIds.has(act.id) ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}
              >
                <div>
                  <span className={`px-4 py-2 text-base font-bold rounded-full text-white ${
                    act.type === ActivityType.PHYSICAL ? 'bg-blue-500' :
                    act.type === ActivityType.SOCIAL ? 'bg-green-500' : 'bg-purple-500'
                  }`}>{act.type}</span>
                  <p className="text-2xl font-semibold mt-3">{act.description}</p>
                  <p className="text-lg text-gray-500">{new Date(act.date).toLocaleDateString()} - {act.durationMinutes} mins</p>
                </div>
                <button onClick={() => setItemToDelete(act.id)} className="p-3 rounded-full text-gray-400 hover:bg-red-100 hover:text-error" aria-label={`Delete activity: ${act.description}`}>
                  <span className="w-8 h-8 block"><TrashIcon /></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Activity">
        <div className="space-y-6">
          <select value={newActivity.type} onChange={e => setNewActivity({...newActivity, type: e.target.value as ActivityType})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none bg-input-bg text-input-text">
            {Object.values(ActivityType).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <input type="text" placeholder="Activity Description" value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full p-5 text-xl border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none bg-input-bg text-input-text placeholder-gray-400"/>
          <div>
             <label htmlFor="duration" className="block text-xl font-medium text-gray-700">Duration (minutes): {newActivity.durationMinutes}</label>
             <input id="duration" type="range" min="5" max="180" step="5" value={newActivity.durationMinutes} onChange={e => setNewActivity({...newActivity, durationMinutes: parseInt(e.target.value)})} className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent mt-2"/>
          </div>
          <Button onClick={handleAddActivity} className="w-full bg-accent text-white hover:bg-pink-700">Log Activity</Button>
        </div>
      </Modal>

      <Modal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} title="Confirm Deletion">
        <div className="space-y-8 text-center">
          <p className="text-3xl">Are you sure you want to delete this activity?</p>
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

export default ActivityTracker;