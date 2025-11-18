import React from 'react';
import { triggerHapticFeedback } from '../../utils/haptics';

// Helper to convert 24h string to 12h object
const from24h = (time: string): { hour: number, minute: number, period: 'AM' | 'PM' } => {
    let [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12; // convert 0 to 12
    return { hour: h, minute: m, period };
};

// Helper to convert 12h object to 24h string
const to24h = (hour: number, minute: number, period: 'AM' | 'PM'): string => {
    let h = hour;
    if (period === 'PM' && h < 12) {
        h += 12;
    }
    if (period === 'AM' && h === 12) {
        h = 0;
    }
    return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const TimePickerButton: React.FC<{ children: React.ReactNode, onClick: () => void, 'aria-label': string }> = ({ children, onClick, 'aria-label': ariaLabel }) => (
    <button 
      onClick={() => {
        triggerHapticFeedback();
        onClick();
      }} 
      aria-label={ariaLabel} 
      className="text-2xl p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition-colors duration-200"
    >
      {children}
    </button>
);

interface TimePickerProps {
  time: string;
  onChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ time, onChange }) => {
  const timeObj = from24h(time);
  const [hour, setHour] = React.useState(timeObj.hour);
  const [minute, setMinute] = React.useState(timeObj.minute);
  const [period, setPeriod] = React.useState(timeObj.period);

  React.useEffect(() => {
    onChange(to24h(hour, minute, period));
  }, [hour, minute, period, onChange]);

  const incrementHour = () => setHour(prev => prev === 12 ? 1 : prev + 1);
  const decrementHour = () => setHour(prev => prev === 1 ? 12 : prev - 1);
  const incrementMinute = () => setMinute(prev => (prev + 5) % 60);
  const decrementMinute = () => setMinute(prev => prev === 0 ? 55 : prev - 5);
  const togglePeriod = () => setPeriod(prev => prev === 'AM' ? 'PM' : 'AM');

  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        <TimePickerButton onClick={incrementHour} aria-label="Increase hour">+</TimePickerButton>
        <span className="text-4xl font-bold py-2 text-gray-800 dark:text-gray-200 min-w-[3ch] text-center">{hour}</span>
        <TimePickerButton onClick={decrementHour} aria-label="Decrease hour">-</TimePickerButton>
      </div>
      
      <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">:</span>
      
      <div className="flex flex-col items-center">
        <TimePickerButton onClick={incrementMinute} aria-label="Increase minute">+</TimePickerButton>
        <span className="text-4xl font-bold py-2 text-gray-800 dark:text-gray-200 min-w-[3ch] text-center">{String(minute).padStart(2, '0')}</span>
        <TimePickerButton onClick={decrementMinute} aria-label="Decrease minute">-</TimePickerButton>
      </div>
      
      <div className="flex flex-col items-center">
        <TimePickerButton onClick={togglePeriod} aria-label="Toggle AM/PM">{period}</TimePickerButton>
      </div>
    </div>
  );
};