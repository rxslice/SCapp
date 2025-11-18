import React from 'react';
import type { AppSettings, AppData, Theme, FontSize } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface SettingsProps {
  settings: AppSettings;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setAppData, notificationPermission, requestNotificationPermission }) => {
  const updateSettings = (key: keyof AppSettings, value: string) => {
    setAppData(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  };
  
  const themes: { id: Theme; label: string; colors: string; }[] = [
    { id: 'light', label: 'Light', colors: 'bg-base-100 border-base-300' },
    { id: 'dark', label: 'Dark', colors: 'bg-neutral text-base-100 border-gray-600' },
    { id: 'high-contrast', label: 'High Contrast', colors: 'bg-black text-yellow-300 border-yellow-300' },
  ];
  
  const fontSizes: { id: FontSize, label: string }[] = [
      { id: 'text-xl', label: 'Default'},
      { id: 'text-2xl', label: 'Medium'},
      { id: 'text-3xl', label: 'Large'},
      { id: 'text-4xl', label: 'Extra Large'}
  ];

  const renderNotificationStatus = () => {
    switch (notificationPermission) {
      case 'granted':
        return <p className="text-xl text-center text-success font-semibold">Alarms and notifications are enabled.</p>;
      case 'denied':
        return (
          <div className="text-center">
            <p className="text-xl text-error font-semibold">Important reminders are blocked.</p>
            <p className="text-lg text-gray-500 mt-2">To receive alerts on your device, you need to allow notifications in your browser settings. This lets the app send you medication and appointment reminders, even when you're offline.</p>
          </div>
        );
      case 'default':
      default:
        return (
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-6">Enable alarms and spoken alerts for medication and appointment reminders.</p>
            <Button onClick={requestNotificationPermission} variant="primary">Enable Notifications</Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-6xl font-bold text-neutral">Settings</h1>
      
      <Card>
        <h2 className="text-4xl font-bold mb-6">Color Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => updateSettings('theme', theme.id)}
              className={`p-6 rounded-lg border-4 transition-all ${
                settings.theme === theme.id ? 'border-primary scale-105' : 'border-transparent'
              }`}
            >
              <div className={`${theme.colors} w-full h-32 rounded-md flex items-center justify-center text-2xl font-bold shadow-inner`}>
                {theme.label}
              </div>
            </button>
          ))}
        </div>
      </Card>
      
      <Card>
        <h2 className="text-4xl font-bold mb-6">Font Size</h2>
         <div className="flex items-center justify-around bg-base-200 p-6 rounded-lg">
            {fontSizes.map(size => (
                <button
                    key={size.id}
                    onClick={() => updateSettings('fontSize', size.id)}
                    className={`px-8 py-4 rounded-lg font-bold transition-colors ${
                        settings.fontSize === size.id ? 'bg-primary text-primary-content' : 'hover:bg-primary/20'
                    }`}
                >
                    <span className={size.id}>Aa</span>
                </button>
            ))}
        </div>
        <p className="text-center mt-6 text-lg text-gray-600">Current Size: <span className="font-bold">{fontSizes.find(s => s.id === settings.fontSize)?.label}</span></p>
      </Card>
      
      <Card>
        <h2 className="text-4xl font-bold mb-6 text-center">Notifications & Alarms</h2>
        <div className="bg-base-200 p-8 rounded-lg">
          {renderNotificationStatus()}
        </div>
      </Card>
    </div>
  );
};

export default Settings;