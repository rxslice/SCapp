import { useState, useEffect, useRef } from 'react';
import type { AppData } from '../types';
import { speak } from '../utils/speaker';

export function useNotifier(appData: AppData) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  );
  const notifiedTodayRef = useRef<Set<string>>(new Set());
  const lastCheckedDay = useRef<number | null>(null);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  useEffect(() => {
    if (permission !== 'granted') return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentDay = now.getDate();

      // Reset notified set at midnight
      if (lastCheckedDay.current !== currentDay) {
        notifiedTodayRef.current.clear();
        lastCheckedDay.current = currentDay;
      }

      const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      // Check medications
      appData.medications.forEach(med => {
        const notificationId = `med-${med.id}`;
        if (med.time === currentTime && !med.taken && !notifiedTodayRef.current.has(notificationId)) {
          const title = 'Medication Reminder';
          const body = `It's time to take your ${med.name} (${med.dosage}).`;
          new Notification(title, { body, tag: notificationId });
          speak(body);
          notifiedTodayRef.current.add(notificationId);
        }
      });

      // Check appointments
      appData.appointments.forEach(appt => {
        try {
            const apptDateTime = new Date(`${appt.date}T${appt.time}`);
            if (isNaN(apptDateTime.getTime())) {
                return; // Invalid date, skip
            }
            const reminderTime = new Date(apptDateTime.getTime() - 15 * 60 * 1000); // 15 minutes before
            const notificationId = `appt-${appt.id}`;
            
            const reminderDateStr = reminderTime.toISOString().split('T')[0];
            const currentDateStr = now.toISOString().split('T')[0];

            if (
              reminderDateStr === currentDateStr &&
              reminderTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) === currentTime &&
              !notifiedTodayRef.current.has(notificationId)
            ) {
              const title = 'Appointment Reminder';
              const body = `Your appointment "${appt.title}" is in 15 minutes at ${appt.time}.`;
              new Notification(title, { body, tag: notificationId });
              speak(body);
              notifiedTodayRef.current.add(notificationId);
            }
        } catch(e) {
            console.error("Error processing appointment notification", appt, e);
        }
      });

    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [permission, appData.medications, appData.appointments]);

  return { permission, requestNotificationPermission };
}