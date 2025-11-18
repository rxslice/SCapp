import React from 'react';
import type { AppData } from '../types';
import { View } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { PillIcon, CalendarIcon, HeartIcon, ExclamationIcon } from './common/Icons';

interface DashboardProps {
  appData: AppData;
  setAppData: (data: AppData) => void;
  setCurrentView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appData, setCurrentView }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const upcomingAppointment = appData.appointments
    .filter(a => new Date(a.date) >= new Date(today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const todaysMedications = appData.medications.filter(m => !m.taken).length;
  const totalMeds = appData.medications.length;
  
  const todaysActivities = appData.activities.filter(a => a.date === today).length;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-6xl font-bold text-neutral">{greeting()}!</h1>
        <p className="text-2xl text-gray-500 mt-3">Here's a look at your day.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        {/* Medications Widget */}
        <Card className="flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center gap-5">
            <div className="bg-primary/10 p-4 rounded-full text-primary"><span className="w-10 h-10 block"><PillIcon/></span></div>
            <h2 className="text-3xl font-bold">Medications</h2>
          </div>
          <p className="text-xl my-6">You have <span className="font-bold text-primary">{todaysMedications} of {totalMeds}</span> medications remaining today.</p>
          <Button onClick={() => setCurrentView(View.MEDICATIONS)}>Manage Meds</Button>
        </Card>

        {/* Appointments Widget */}
        <Card className="flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center gap-5">
            <div className="bg-secondary/10 p-4 rounded-full text-secondary"><span className="w-10 h-10 block"><CalendarIcon/></span></div>
            <h2 className="text-3xl font-bold">Appointments</h2>
          </div>
          {upcomingAppointment ? (
             <div className="text-xl my-6">
                <p>Next: <span className="font-bold text-secondary">{upcomingAppointment.title}</span></p>
                <p>{new Date(upcomingAppointment.date).toDateString()} at {upcomingAppointment.time}</p>
             </div>
          ) : (
            <p className="text-xl my-6">No upcoming appointments.</p>
          )}
          <Button variant="secondary" onClick={() => setCurrentView(View.APPOINTMENTS)}>View Calendar</Button>
        </Card>

        {/* Activities Widget */}
        <Card className="flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center gap-5">
            <div className="bg-accent/10 p-4 rounded-full text-accent"><span className="w-10 h-10 block"><HeartIcon/></span></div>
            <h2 className="text-3xl font-bold">Activities</h2>
          </div>
          <p className="text-xl my-6">You've logged <span className="font-bold text-accent">{todaysActivities}</span> activities today. Keep it up!</p>
          <Button className="bg-accent text-white hover:bg-pink-700" onClick={() => setCurrentView(View.ACTIVITIES)}>Track Activity</Button>
        </Card>
      </div>

      {/* Emergency Info Card */}
      <Card className="bg-error/10 border border-error hover:shadow-2xl hover:-translate-y-1">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-error"><span className="w-20 h-20 block"><ExclamationIcon/></span></div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold text-error">Emergency Info</h2>
            <p className="text-xl mt-2">In case of an emergency, your information is ready and accessible.</p>
          </div>
          <Button variant="danger" onClick={() => setCurrentView(View.EMERGENCY)}>View Info</Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;