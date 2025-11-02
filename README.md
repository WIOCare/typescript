# Location Tracker

A modern, secure location tracking web application built with React, TypeScript, and Vite. Share your real-time location with friends and family using phone number authentication.

## Features

- **Phone Number Authentication**: Secure OTP-based login system using mobile numbers
- **Real-time Location Tracking**: Share and track locations in real-time with live updates
- **Interactive Maps**: Beautiful, interactive maps powered by Leaflet and OpenStreetMap
- **Location Permissions**: Fine-grained permission management for location access
- **Time-based Sharing**: Set expiration times for location sharing links (15 min to 24 hours)
- **Phone Number Authorization**: Optional whitelist of phone numbers for restricted access
- **Responsive Design**: Modern, mobile-first UI that works seamlessly on all devices
- **Live Updates**: Auto-refresh location data every 5 seconds
- **Privacy-focused**: Your location data is only shared with your explicit permission

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for modern, responsive design
- **Maps**: Leaflet & React-Leaflet for interactive mapping
- **State Management**: Zustand for lightweight, efficient state management
- **Routing**: React Router v6 for client-side routing
- **Notifications**: React Hot Toast for elegant toast notifications
- **Icons**: Lucide React for beautiful, consistent icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd location-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

For testing purposes, use any phone number and OTP `1234` to login.

## Project Structure

```
location-tracker/
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # Main layout with navigation
│   │   └── LocationMap.tsx      # Leaflet map component
│   ├── pages/
│   │   ├── AuthPage.tsx         # Phone authentication page
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── ShareLocation.tsx    # Location sharing interface
│   │   └── TrackLocation.tsx    # Location tracking view
│   ├── store/
│   │   ├── authStore.ts         # Authentication state
│   │   └── locationStore.ts     # Location data state
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication

- Phone number-based authentication with OTP verification
- Session persistence using localStorage
- Secure logout functionality

### Location Tracking

- Browser Geolocation API integration
- Real-time location updates
- Accuracy information display
- Fallback for denied permissions

### Location Sharing

- Generate shareable tracking links
- Set custom expiration times
- Optional phone number whitelist for access control
- Live location updates while sharing
- Easy copy-to-clipboard functionality

### Map Integration

- Interactive Leaflet maps with OpenStreetMap tiles
- Custom marker icons for active tracking
- Detailed location popups
- Auto-centering on location updates
- Direct links to Google Maps and Apple Maps

## Security Features

- Phone number verification
- OTP-based authentication
- Optional access control with phone number whitelists
- Time-based link expiration
- No location data stored without permission

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Requires browser support for:
- Geolocation API
- localStorage
- ES2020+ JavaScript features

## Future Enhancements

- Backend API integration for persistent data storage
- SMS OTP delivery via Twilio/similar service
- Push notifications for location updates
- History and location breadcrumbs
- Multiple simultaneous location tracking
- Group location sharing
- Geofencing and alerts
- Dark mode support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [Leaflet](https://leafletjs.com/) - Interactive mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) - Map data
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon set

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Vite
