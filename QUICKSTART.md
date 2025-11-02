# Quick Start Guide

Get your Location Tracker application up and running in minutes!

## Prerequisites

- Node.js 16+ installed on your system
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including React, Vite, Tailwind CSS, Leaflet, and more.

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`. You should see the authentication page.

## Using the Application

### Step 1: Login

1. On the authentication page, optionally enter your name
2. Enter any phone number (e.g., +1234567890)
3. Click "Send OTP"
4. Enter the OTP: **1234** (this is the demo OTP for testing)
5. Click "Verify & Continue"

### Step 2: Grant Location Permission

1. After logging in, you'll be redirected to the dashboard
2. Your browser will prompt you to allow location access
3. Click "Allow" to enable location features
4. Alternatively, click the "Get Current Location" button on the dashboard

### Step 3: View Your Location

Once permission is granted:
- Your current location will be displayed on an interactive map
- You'll see your coordinates, accuracy, and last update time
- The map uses OpenStreetMap tiles with Leaflet

### Step 4: Share Your Location

1. Navigate to "Share Location" from the menu
2. Configure sharing settings:
   - **Duration**: Choose how long to share (15 min to 24 hours)
   - **Allowed Phone Numbers**: Optionally restrict access to specific numbers
3. Click "Start Sharing Location"
4. You'll receive a shareable tracking link
5. Copy the link and share it with anyone you want to track your location

### Step 5: Track Someone's Location

1. When someone shares their location link with you, click it
2. If phone verification is required, enter your phone number
3. You'll see their real-time location on an interactive map
4. The location updates automatically every 5 seconds
5. Use the "Open in Google Maps" or "Apple Maps" buttons for navigation

## Features Demo

### Dashboard Features
- View current location on map
- See location statistics (accuracy, last update)
- Quick access to sharing features
- List of active shared locations

### Sharing Features
- Generate time-limited tracking links
- Set custom expiration times
- Optional phone number whitelist
- Live location updates while sharing
- Easy copy-to-clipboard for sharing

### Tracking Features
- Real-time location updates
- Interactive map with custom markers
- Location details (coordinates, accuracy, timestamp)
- Direct links to navigation apps
- Auto-refresh every 5 seconds

## Browser Permissions

The application requires the following browser permissions:

### Geolocation
- **Required for**: Getting and sharing your location
- **How to enable**:
  - Chrome: Click the lock icon in the address bar → Site Settings → Location → Allow
  - Firefox: Click the shield icon → Permissions → Access Your Location → Allow
  - Safari: Settings → Privacy → Location Services → Enable for your browser

### Clipboard (Optional)
- **Used for**: Copy link to clipboard feature
- **Fallback**: Manual copy if permission denied

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and deploy

### Netlify

1. Push your code to GitHub
2. Import the project on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### Other Platforms

You can deploy to any static hosting platform. Just run `npm run build` and upload the `dist` folder contents.

## Troubleshooting

### "Location permission denied"
- Check your browser's location settings
- Make sure you're using HTTPS (or localhost for development)
- Some browsers block location on non-secure connections

### "Geolocation is not supported"
- Update your browser to the latest version
- Try a different browser (Chrome, Firefox, Safari recommended)

### Map not loading
- Check your internet connection (maps require online access)
- Verify that OpenStreetMap is not blocked by your firewall
- Clear browser cache and reload

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Application not starting
```bash
# Check if port 3000 is available
lsof -ti:3000

# Kill process using port 3000 (if needed)
kill -9 $(lsof -ti:3000)

# Start on different port
npm run dev -- --port 3001
```

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR. Edit any component and see changes immediately without losing state.

### TypeScript
The project uses strict TypeScript. If you see type errors:
```bash
npm run build  # Type check entire project
```

### Tailwind CSS
Use Tailwind utility classes for styling. See [Tailwind Docs](https://tailwindcss.com/docs) for available classes.

### State Management
- Authentication state: `src/store/authStore.ts`
- Location state: `src/store/locationStore.ts`
- Uses Zustand for lightweight state management

## Next Steps

### Add Backend Integration

Currently, the app uses mock data and browser storage. To add a real backend:

1. Review `API_STRUCTURE.md` for API endpoint specifications
2. Replace mock data in stores with real API calls
3. Implement WebSocket for real-time updates
4. Add OTP delivery via SMS service (Twilio, etc.)

### Customize Styling

1. Edit `tailwind.config.js` for custom colors and themes
2. Modify `src/index.css` for global styles
3. Update component styles in individual files

### Add Features

Some ideas for enhancements:
- Location history and breadcrumbs
- Multiple simultaneous tracking
- Geofencing and alerts
- Dark mode
- Export location data
- Group sharing features

## Support & Documentation

- **Main README**: See `README.md` for comprehensive documentation
- **API Structure**: See `API_STRUCTURE.md` for backend specifications
- **Issues**: Report bugs or request features on GitHub

## Demo Credentials

For testing without a backend:
- **Phone Number**: Any valid phone number format
- **OTP**: `1234`

Happy tracking! 🗺️📍
