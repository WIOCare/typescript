"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mobileNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    // Simulate OTP sending
    setStep("otp");
    console.log("OTP sent to:", mobileNumber);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simulate OTP verification (accept any 4-digit OTP for demo)
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    // Store user session
    localStorage.setItem("user", JSON.stringify({ 
      mobile: mobileNumber,
      id: Date.now().toString()
    }));

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Location Tracker</h1>
            <p className="text-gray-600">Track and share your location securely</p>
          </div>

          {/* Phone Number Step */}
          {step === "phone" && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Send OTP
              </button>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="Enter 4-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                  required
                  autoFocus
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  OTP sent to +91 {mobileNumber}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-gray-600 py-2 text-sm hover:text-gray-900 transition-colors"
                >
                  Change Number
                </button>
              </div>
            </form>
          )}

          {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Demo Mode</p>
            <p className="text-xs text-blue-600">Enter any 10-digit number and any 4-digit OTP to login</p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">Secure</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">Real-time</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">Private</p>
          </div>
        </div>
      </div>
    </div>
  );
}
