"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

interface User {
  mobile: string;
  id: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

interface TrackedUser {
  id: string;
  mobile: string;
  location?: LocationData;
  hasPermission: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackedUsers, setTrackedUsers] = useState<TrackedUser[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserMobile, setNewUserMobile] = useState("");

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    localStorage.setItem("isTracking", "false");
    const watchId = localStorage.getItem("watchId");
    if (watchId) {
      navigator.geolocation.clearWatch(parseInt(watchId));
    }
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsTracking(true);
    localStorage.setItem("isTracking", "true");

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
        };
        setLocation(newLocation);
        localStorage.setItem("myLocation", JSON.stringify(newLocation));
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please enable location permissions.");
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Store watch ID for cleanup
    localStorage.setItem("watchId", watchId.toString());
  }, [stopTracking]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    const saved = localStorage.getItem("trackedUsers");
    const parsedTrackedUsers = saved ? JSON.parse(saved) : [];
    const trackingState = localStorage.getItem("isTracking");
    
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setUser(parsedUser);
      setTrackedUsers(parsedTrackedUsers);
      
      if (trackingState === "true") {
        startTracking();
      }
    }, 0);
  }, [router, startTracking]);

  const addTrackedUser = () => {
    if (newUserMobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const newUser: TrackedUser = {
      id: Date.now().toString(),
      mobile: newUserMobile,
      hasPermission: true,
    };

    const updated = [...trackedUsers, newUser];
    setTrackedUsers(updated);
    localStorage.setItem("trackedUsers", JSON.stringify(updated));
    setNewUserMobile("");
    setShowAddUser(false);
  };

  const removeTrackedUser = (id: string) => {
    const updated = trackedUsers.filter((u) => u.id !== id);
    setTrackedUsers(updated);
    localStorage.setItem("trackedUsers", JSON.stringify(updated));
  };

  const handleLogout = () => {
    stopTracking();
    localStorage.removeItem("user");
    localStorage.removeItem("myLocation");
    localStorage.removeItem("trackedUsers");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Location Tracker</h1>
                <p className="text-sm text-gray-500">+91 {user.mobile}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tracking Control */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Location</h2>
              
              <div className="space-y-3">
                <button
                  onClick={isTracking ? stopTracking : startTracking}
                  className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                    isTracking
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  }`}
                >
                  {isTracking ? "Stop Tracking" : "Start Tracking"}
                </button>

                {location && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latitude:</span>
                      <span className="font-mono text-gray-900">{location.latitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Longitude:</span>
                      <span className="font-mono text-gray-900">{location.longitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accuracy:</span>
                      <span className="text-gray-900">{location.accuracy.toFixed(0)}m</span>
                    </div>
                  </div>
                )}

                {isTracking && (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Tracking Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <Link href="/permissions">
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Manage Permissions</p>
                      <p className="text-xs text-gray-600">Control who can track you</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>

            {/* Tracked Users */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Shared With</h2>
                <button
                  onClick={() => setShowAddUser(!showAddUser)}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {showAddUser && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="tel"
                    value={newUserMobile}
                    onChange={(e) => setNewUserMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={addTrackedUser}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddUser(false);
                        setNewUserMobile("");
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {trackedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No users added yet</p>
                ) : (
                  trackedUsers.map((trackedUser) => (
                    <div
                      key={trackedUser.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {trackedUser.mobile.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">+91 {trackedUser.mobile}</p>
                          <p className="text-xs text-green-600">Can track you</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeTrackedUser(trackedUser.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-[600px]">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Map</h2>
              {location ? (
                <MapView location={location} />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center space-y-3">
                    <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-gray-600 font-medium">Start tracking to see your location on the map</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
