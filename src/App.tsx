import React, { useState, useEffect, useMemo } from 'react';
import { View, type AppData, type FontSize, type Medication, type Appointment } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useNotifier } from './hooks/useNotifier';
import { useGeminiAssistant } from './hooks/useGeminiAssistant';
import { v4 as uuidv4 } from 'uuid';
import Dashboard from './components/Dashboard';
import MedicationManager from './components/MedicationManager';
import AppointmentCalendar from './components/AppointmentCalendar';
import ActivityTracker from './components/ActivityTracker';
import EmergencyInfo from './components/EmergencyInfo';
import Settings from './components/Settings';
import { initialData } from './constants';
import { HomeIcon, PillIcon, CalendarIcon, HeartIcon, ExclamationIcon, CogIcon, MicIcon, SpinnerIcon } from './components/common/Icons';
import { speak } from './utils/speaker';
import Toast from './components/common/Toast';
import { triggerHapticFeedback } from './utils/haptics';


export default function App() {
  const [appData, setAppData] = useLocalStorage<AppData>('seniorCareData', initialData);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  
  const { isListening, transcript, startListening, stopListening, isSupported, error: speechError } = useSpeechRecognition();
  const { permission, requestNotificationPermission } = useNotifier(appData);
  const { isProcessing, processTranscript } = useGeminiAssistant();
  const [toast, setToast] = useState({ message: '', type: 'error' as 'error' | 'success', isVisible: false });
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    if(speechError) {
      showToast(speechError);
    }
  }, [speechError]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(appData.settings.theme);

    const fontSizeMapping: Record<FontSize, string> = {
      'text-xl': '100%',
      'text-2xl': '112.5%',
      'text-3xl': '125%',
      'text-4xl': '137.5%',
    };
    root.style.fontSize = fontSizeMapping[appData.settings.fontSize] || '112.5%';
    
  }, [appData.settings]);

  useEffect(() => {
    if (transcript) {
        stopListening();
        handleVoiceCommand(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const handleVoiceCommand = async (command: string) => {
      const functionCalls = await processTranscript(command);
      if (!functionCalls) return;

      for (const call of functionCalls) {
          console.log('Executing function call:', call);
          let announcement = '';

          switch (call.name) {
              case 'navigateToView':
                  const view = call.args.view as View;
                  if(Object.values(View).includes(view)) {
                      setCurrentView(view);
                      announcement = `Navigating to ${view.toLowerCase()}.`;
                  } else {
                      announcement = `Sorry, I can't navigate to ${view}.`;
                  }
                  break;

              case 'addMedication':
                  const { name, dosage, time } = call.args;
                  if (name && dosage && time) {
                      const newMed: Medication = { id: uuidv4(), name: name as string, dosage: dosage as string, time: time as string, taken: false };
                      setAppData(prev => ({ ...prev, medications: [...prev.medications, newMed].sort((a,b) => a.time.localeCompare(b.time)) }));
                      announcement = `Okay, I've added ${name} to your schedule at ${time}.`;
                  } else {
                      announcement = "I'm sorry, I didn't get all the details for the medication. Please try again.";
                  }
                  break;

              case 'markMedicationAsTaken':
                  const medName = (call.args.name as string).toLowerCase();
                  let foundMed = false;
                  setAppData(prev => {
                      const newMeds = prev.medications.map(med => {
                          if (med.name.toLowerCase() === medName && !med.taken) {
                              foundMed = true;
                              return { ...med, taken: true };
                          }
                          return med;
                      });
                      return { ...prev, medications: newMeds };
                  });
                  announcement = foundMed ? `Okay, I've marked ${call.args.name} as taken.` : `I couldn't find an untaken medication named ${call.args.name}.`;
                  break;

              case 'addAppointment':
                  const { title, date, time: apptTime, location } = call.args;
                  if (title && date && apptTime) {
                      const newAppt: Appointment = { id: uuidv4(), title: title as string, date: date as string, time: apptTime as string, location: (location as string) || '', notes: '' };
                       setAppData(prev => ({ ...prev, appointments: [...prev.appointments, newAppt].sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()) }));
                      announcement = `Okay, I've scheduled ${title} for ${date} at ${apptTime}.`;
                  } else {
                      announcement = "I'm sorry, I didn't get all the details for the appointment. Please try again.";
                  }
                  break;

              case 'getDailySummary':
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const untakenMeds = appData.medications.filter(m => !m.taken);
                  const upcomingAppts = appData.appointments.filter(a => new Date(a.date) >= today)
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                  
                  let summary = '';
                  if (untakenMeds.length > 0) {
                      summary += `You have ${untakenMeds.length} medications left today. `;
                  } else {
                      summary += 'You have taken all your medications for today. ';
                  }
                  if (upcomingAppts.length > 0) {
                      const nextAppt = upcomingAppts[0];
                      const apptDate = new Date(nextAppt.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
                      summary += `Your next appointment is ${nextAppt.title} on ${apptDate} at ${nextAppt.time}.`;
                  } else {
                      summary += 'You have no upcoming appointments.';
                  }
                  announcement = summary;
                  break;

              case 'speak':
                  announcement = call.args.message as string;
                  break;
                  
              default:
                  announcement = "Sorry, I'm not sure how to do that.";
          }

          if (announcement) {
              speak(announcement);
              setAriaAnnouncement(announcement);
          }
      }
  };


  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard appData={appData} setAppData={setAppData} setCurrentView={setCurrentView} />;
      case View.MEDICATIONS:
        return <MedicationManager medications={appData.medications} setAppData={setAppData} />;
      case View.APPOINTMENTS:
        return <AppointmentCalendar appointments={appData.appointments} setAppData={setAppData} />;
      case View.ACTIVITIES:
        return <ActivityTracker activities={appData.activities} setAppData={setAppData} />;
      case View.EMERGENCY:
        return <EmergencyInfo info={appData.emergencyInfo} setAppData={setAppData} />;
      case View.SETTINGS:
        return <Settings
                  settings={appData.settings}
                  setAppData={setAppData}
                  notificationPermission={permission}
                  requestNotificationPermission={requestNotificationPermission}
                />;
      default:
        return <Dashboard appData={appData} setAppData={setAppData} setCurrentView={setCurrentView} />;
    }
  };

  const navItems = useMemo(() => [
    { view: View.DASHBOARD, label: 'Dashboard', icon: <HomeIcon /> },
    { view: View.MEDICATIONS, label: 'Medications', icon: <PillIcon /> },
    { view: View.APPOINTMENTS, label: 'Appointments', icon: <CalendarIcon /> },
    { view: View.ACTIVITIES, label: 'Activities', icon: <HeartIcon /> },
    { view: View.EMERGENCY, label: 'Emergency', icon: <ExclamationIcon /> },
    { view: View.SETTINGS, label: 'Settings', icon: <CogIcon /> },
  ], []);

  const handleMicClick = () => {
    triggerHapticFeedback();
    isListening ? stopListening() : startListening();
  };

  return (
    <div className={`flex h-screen bg-base-200 text-neutral transition-colors duration-300`}>
      {/* Sidebar Navigation */}
      <aside className="w-48 bg-base-100 flex flex-col items-center p-6 shadow-lg">
        <div className="text-primary font-bold text-4xl mb-16">SC</div>
        <nav className="flex flex-col items-center space-y-10">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 w-32 h-32 justify-center
                ${currentView === item.view ? 'bg-primary text-primary-content shadow-lg scale-110' : 'hover:bg-primary/10'}`}
              title={item.label}
            >
              <div className="w-16 h-16">{item.icon}</div>
              <span className="text-lg mt-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {renderView()}
      </main>

      {/* Voice Command Button */}
      {isSupported && (
        <div className="absolute bottom-8 right-8">
          <button
            onClick={handleMicClick}
            disabled={isProcessing}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300
              ${isProcessing
                ? 'bg-gray-500 cursor-not-allowed'
                : isListening 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-secondary hover:bg-secondary-focus'}`}
            aria-label={isProcessing ? 'Processing command' : isListening ? 'Stop Listening' : 'Start Voice Command'}
          >
            <div className="w-12 h-12">
              {isProcessing ? <SpinnerIcon/> : <MicIcon />}
            </div>
          </button>
        </div>
      )}

      <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
      <div className="sr-only" aria-live="polite" aria-atomic="true">{ariaAnnouncement}</div>
    </div>
  );
}