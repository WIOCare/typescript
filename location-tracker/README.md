# 📍 Location Tracker

A modern, real-time location tracking web application with mobile number-based permission management. Built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

- 🔐 **Mobile Number Authentication** - Secure OTP-based login system
- 📍 **Real-time Location Tracking** - Track your location with high accuracy
- 🗺️ **Interactive Maps** - Visualize locations using Leaflet maps
- 👥 **Permission Management** - Control who can track your location
- 🎨 **Modern UI** - Beautiful, responsive interface with gradient designs
- 🔒 **Privacy First** - All data stored locally on your device
- ⚡ **Fast & Responsive** - Built with Next.js 14 and Turbopack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Modern web browser with Geolocation API support

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd location-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📱 How to Use

### 1. Authentication
- Enter any 10-digit mobile number
- Click "Send OTP"
- Enter any 4-digit OTP (demo mode)
- Click "Verify OTP" to login

### 2. Start Tracking
- Click "Start Tracking" on the dashboard
- Allow location permissions when prompted by your browser
- Your location will appear on the map in real-time

### 3. Share Location
- Click "Manage Permissions" to control access
- Add mobile numbers of users who can track you
- Toggle permissions on/off anytime
- Remove users to revoke access completely

### 4. Add Tracked Users
- In the "Shared With" section, click the + button
- Enter a mobile number
- The user will be able to see your location when tracking is active

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet & React-Leaflet
- **Icons:** SVG (inline)
- **Storage:** LocalStorage (browser)

## 📂 Project Structure

```
location-tracker/
├── app/
│   ├── page.tsx              # Authentication page
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   ├── permissions/
│   │   └── page.tsx          # Permission management
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── MapView.tsx           # Map component
├── public/                   # Static assets
└── package.json              # Dependencies
```

## 🔒 Privacy & Security

- **Local Storage Only:** All data is stored in your browser's localStorage
- **No Backend:** No data is sent to any server
- **Permission-Based:** You control who can track your location
- **Browser Permissions:** Requires explicit browser location permission
- **Demo Mode:** OTP verification is simulated for demonstration

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

All browsers must support:
- Geolocation API
- LocalStorage
- ES6+ JavaScript

## 📝 Features in Detail

### Location Tracking
- Uses browser's Geolocation API
- High accuracy mode enabled
- Real-time position updates
- Accuracy circle visualization
- Latitude/Longitude display

### Permission System
- Add/remove users by mobile number
- Toggle permissions on/off
- View permission statistics
- Track when permissions were granted

### Map Integration
- OpenStreetMap tiles
- Custom markers
- Accuracy circles
- Popup information
- Responsive zoom controls

## 🎨 Design Features

- Gradient backgrounds
- Smooth animations
- Responsive layout (mobile-first)
- Modern card-based UI
- Intuitive navigation
- Clean typography
- Accessible color contrast

## 🐛 Known Limitations

- Demo mode only (no real OTP service)
- Data stored locally (cleared on browser cache clear)
- Single user session
- No real-time sync between devices
- Requires active browser tab for continuous tracking

## 🔮 Future Enhancements

- Real backend integration
- Multi-device sync
- Location history
- Geofencing alerts
- Battery optimization
- Offline support
- Push notifications
- Group tracking

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.

---

**Note:** This is a demonstration project. For production use, implement proper authentication, backend services, and security measures.
