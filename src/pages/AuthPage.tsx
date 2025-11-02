import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, MapPin, Users, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function AuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
      toast.success('OTP sent to your phone! (Use 1234 for demo)')
    }, 1500)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 4 && otp.length !== 6) {
      toast.error('Please enter a valid OTP')
      return
    }
    setLoading(true)
    try {
      await login(phoneNumber, otp, name || undefined)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero section */}
        <div className="hidden md:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-12 h-12 text-primary-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Location Tracker
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Share your location securely with friends and family
            </p>
          </div>

          <div className="space-y-4">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Secure & Private"
              description="Your location data is encrypted and only shared with your permission"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Share with Anyone"
              description="Generate tracking links for friends and family to see your location"
            />
            <FeatureCard
              icon={<Phone className="w-6 h-6" />}
              title="Mobile First"
              description="Works seamlessly on all devices with phone number authentication"
            />
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="card max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 'phone' ? 'Get Started' : 'Verify OTP'}
            </h2>
            <p className="text-gray-600">
              {step === 'phone'
                ? 'Enter your phone number to continue'
                : `We sent a code to ${phoneNumber}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="+1 234 567 8900"
                    className="input pl-12"
                    maxLength={15}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="input pl-12 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="btn btn-secondary w-full py-3"
              >
                Change Phone Number
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Demo: Use OTP <span className="font-mono font-bold">1234</span> to login
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}
