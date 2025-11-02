"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  mobile: string;
  id: string;
}

interface Permission {
  id: string;
  mobile: string;
  grantedAt: number;
  canTrack: boolean;
}

export default function Permissions() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showAddPermission, setShowAddPermission] = useState(false);
  const [newPermissionMobile, setNewPermissionMobile] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    const saved = localStorage.getItem("permissions");
    const parsedPermissions = saved ? JSON.parse(saved) : [];
    
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setUser(parsedUser);
      setPermissions(parsedPermissions);
    }, 0);
  }, [router]);

  const addPermission = () => {
    if (newPermissionMobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const newPermission: Permission = {
      id: Date.now().toString(),
      mobile: newPermissionMobile,
      grantedAt: Date.now(),
      canTrack: true,
    };

    const updated = [...permissions, newPermission];
    setPermissions(updated);
    localStorage.setItem("permissions", JSON.stringify(updated));
    setNewPermissionMobile("");
    setShowAddPermission(false);
  };

  const togglePermission = (id: string) => {
    const updated = permissions.map((p) =>
      p.id === id ? { ...p, canTrack: !p.canTrack } : p
    );
    setPermissions(updated);
    localStorage.setItem("permissions", JSON.stringify(updated));
  };

  const removePermission = (id: string) => {
    const updated = permissions.filter((p) => p.id !== id);
    setPermissions(updated);
    localStorage.setItem("permissions", JSON.stringify(updated));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Permission Management</h1>
                <p className="text-sm text-gray-500">Control who can track your location</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Permissions</p>
                <p className="text-3xl font-bold text-gray-900">{permissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {permissions.filter((p) => p.canTrack).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paused</p>
                <p className="text-3xl font-bold text-orange-600">
                  {permissions.filter((p) => !p.canTrack).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Manage Permissions</h2>
            <button
              onClick={() => setShowAddPermission(!showAddPermission)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Permission</span>
            </button>
          </div>

          {showAddPermission && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={newPermissionMobile}
                  onChange={(e) =>
                    setNewPermissionMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={addPermission}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Grant Permission
                </button>
                <button
                  onClick={() => {
                    setShowAddPermission(false);
                    setNewPermissionMobile("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {permissions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-gray-600 font-medium mb-2">No permissions granted yet</p>
                <p className="text-sm text-gray-500">Add users who can track your location</p>
              </div>
            ) : (
              permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {permission.mobile.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">+91 {permission.mobile}</p>
                      <p className="text-xs text-gray-500">
                        Granted {new Date(permission.grantedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => togglePermission(permission.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        permission.canTrack ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          permission.canTrack ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => removePermission(permission.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">About Permissions</p>
              <p className="text-blue-700">
                Users with active permissions can track your real-time location when you have tracking enabled. 
                You can pause or revoke permissions at any time. All permissions are stored locally on your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
