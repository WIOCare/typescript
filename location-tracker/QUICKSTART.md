# 🚀 Quick Start Guide

Get your Location Tracker app running in 3 simple steps!

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Start Development Server
```bash
npm run dev
```

## Step 3: Open in Browser
Navigate to: **http://localhost:3000**

---

## 📱 Demo Login

Since this is a demo application, you can use any credentials:

- **Mobile Number:** Any 10-digit number (e.g., `9876543210`)
- **OTP:** Any 4-digit code (e.g., `1234`)

---

## ✅ Quick Test Flow

1. **Login**
   - Enter: `9876543210`
   - Click "Send OTP"
   - Enter: `1234`
   - Click "Verify OTP"

2. **Enable Tracking**
   - Click "Start Tracking"
   - Allow location access when prompted
   - See your location on the map

3. **Add Users**
   - Click the + button in "Shared With"
   - Add: `9999999999`
   - User can now track you

4. **Manage Permissions**
   - Click "Manage Permissions"
   - Add/remove users
   - Toggle permissions on/off

---

## 🔧 Troubleshooting

### Location not showing?
- Ensure browser location permissions are enabled
- Check if you're using HTTPS or localhost
- Try refreshing the page

### Map not loading?
- Check your internet connection
- Ensure JavaScript is enabled
- Clear browser cache and reload

### Build errors?
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Next Steps

- Read the full [README.md](./README.md)
- Explore the [Dashboard](http://localhost:3000/dashboard)
- Check [Permissions](http://localhost:3000/permissions)

---

**Happy Tracking! 📍**
