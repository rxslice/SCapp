import React, { useState } from 'react';
import type { EmergencyInfoData, AppData } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { EditIcon, CheckIcon } from './common/Icons';

interface EmergencyInfoProps {
  info: EmergencyInfoData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

// Fix for line 18: Changed default `onChange` to accept an argument, resolving a type mismatch when called from the input's `onChange` event.
const InfoRow: React.FC<{ label: string; value: string; isEditing?: boolean; onChange?: (val: string) => void }> = ({ label, value, isEditing = false, onChange = (_val) => {} }) => (
    <div className="py-5 border-b border-gray-200">
        <p className="text-xl font-semibold text-gray-500">{label}</p>
        {isEditing ? (
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 text-2xl bg-input-bg text-input-text rounded-lg mt-2 focus:ring-2 focus:ring-primary focus:outline-none"/>
        ) : (
            <p className="text-3xl font-bold text-neutral">{value}</p>
        )}
    </div>
);


const EmergencyInfo: React.FC<EmergencyInfoProps> = ({ info, setAppData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableInfo, setEditableInfo] = useState(info);
  
  const handleSave = () => {
    setAppData(prev => ({...prev, emergencyInfo: editableInfo}));
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
        handleSave();
    } else {
        setEditableInfo(info);
        setIsEditing(true);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-bold text-error">Emergency Information</h1>
        <Button 
            variant={isEditing ? 'primary' : 'ghost'} 
            onClick={handleEditToggle} 
            Icon={isEditing ? CheckIcon : EditIcon}
            aria-label={isEditing ? 'Save emergency information' : 'Edit emergency information'}
        >
            {isEditing ? 'Save Info' : 'Edit Info'}
        </Button>
      </div>

      <Card>
        <InfoRow label="Primary Doctor" value={editableInfo.primaryDoctor.name} isEditing={isEditing} onChange={val => setEditableInfo(prev => ({...prev, primaryDoctor: {...prev.primaryDoctor, name: val}}))}/>
        <InfoRow label="Doctor's Phone" value={editableInfo.primaryDoctor.phone} isEditing={isEditing} onChange={val => setEditableInfo(prev => ({...prev, primaryDoctor: {...prev.primaryDoctor, phone: val}}))}/>
        <InfoRow label="Allergies" value={editableInfo.allergies} isEditing={isEditing} onChange={val => setEditableInfo(prev => ({...prev, allergies: val}))}/>
        <InfoRow label="Medical Conditions" value={editableInfo.conditions} isEditing={isEditing} onChange={val => setEditableInfo(prev => ({...prev, conditions: val}))}/>
      </Card>

      <h2 className="text-5xl font-bold text-neutral">Emergency Contacts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {info.contacts.map(contact => (
          <Card key={contact.id} className="bg-base-100">
            <p className="text-3xl font-bold">{contact.name}</p>
            <p className="text-xl text-gray-500">{contact.relationship}</p>
            <a href={`tel:${contact.phone}`} className="block mt-6">
                <Button variant="secondary" className="w-full">
                    Call: {contact.phone}
                </Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmergencyInfo;