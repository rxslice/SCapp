# Senior Care Assistant

A comprehensive assistant for seniors to manage medications, appointments, and daily activities with ease. The application features large fonts, voice commands, and stores all data locally on the device for privacy and offline access.

## Features

- 🏠 **Dashboard**: Overview of daily tasks and upcoming events
- 💊 **Medication Management**: Track medications and dosage times
- 📅 **Appointment Calendar**: Manage doctor appointments and reminders
- 🎯 **Activity Tracker**: Monitor daily activities and wellness
- 🚨 **Emergency Information**: Quick access to emergency contacts
- ⚙️ **Settings**: Customize app preferences including themes and fonts
- 🎤 **Voice Commands**: Full voice control for accessibility
- 🌙 **Dark Mode**: Eye-friendly dark theme support
- 📱 **Responsive Design**: Works on all devices
- 🔒 **Privacy First**: All data stored locally on device

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Voice Recognition**: Web Speech API
- **Data Storage**: Local Storage (browser)
- **Accessibility**: ARIA compliant, large fonts, haptic feedback

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built application will be in the `dist` folder.

## Project Structure

```
senior-care-assistant/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # App manifest
├── src/
│   ├── components/         # React components
│   │   ├── common/         # Shared UI components
│   │   ├── Dashboard/      # Dashboard component
│   │   ├── MedicationManager/
│   │   ├── AppointmentCalendar/
│   │   ├── ActivityTracker/
│   │   ├── EmergencyInfo/
│   │   ├── Settings/
│   │   └── ui/            # UI components like TimePicker
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # App constants
│   └── App.tsx           # Main App component
├── assets/               # Images and static assets
├── tools/               # Development tools
└── README.md           # This file
```

## Usage

1. **Dashboard**: View overview of today's medications, upcoming appointments, and activities
2. **Medications**: Add, edit, and track medication schedules
3. **Appointments**: Manage doctor appointments with reminders
4. **Activities**: Set and track daily wellness activities
5. **Emergency**: Store and access emergency contact information
6. **Settings**: Customize theme, font size, and voice settings

### Voice Commands

The app supports voice commands for hands-free operation:
- "Show medications" - Navigate to medication screen
- "Show appointments" - Navigate to calendar
- "Emergency contacts" - Quick access to emergency info

## Accessibility Features

- Large, readable fonts with customizable sizes
- High contrast themes available
- Full keyboard navigation support
- Screen reader compatibility
- Voice command support
- Haptic feedback on supported devices

## Privacy & Security

- All data is stored locally on your device
- No data is transmitted to external servers
- Works completely offline after initial load
- No account creation or personal information required

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with Web Speech API support

## Contributing

This is a complete application ready for use. For customizations or improvements, modify the sour   # Da is dul requireddiffo

#to externatibility

- Chrompernad
88+
- Firefolital +
- Safari 14