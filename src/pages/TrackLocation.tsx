import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Navigation, Clock, User, Phone, ArrowLeft, RefreshCw } from 'lucide-react'
import { LocationData } from '../store/locationStore'
import LocationMap from '../components/LocationMap'
import toast from 'react-hot-toast'

export default function TrackLocation() {
  const { trackingId } = useParams<{ trackingId: string }>()
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [phoneVerification, setPhoneVerification] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [requiresVerification] = useState(false) // Set to true if phone verification is required

  useEffect(() => {
    if (trackingId && (!requiresVerification || isVerified)) {
      fetchLocation()
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchLocation, 5000)
      return () => clearInterval(interval)
    }
  }, [trackingId, isVerified])

  const fetchLocation = async () => {
    try {
      // In production, this would be an API call to your backend
      // For demo, we'll simulate fetching location data
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate location data (in production, fetch from backend)
      const mockLocation: LocationData = {
        id: trackingId || '',
        userId: 'user123',
        userName: 'Demo User',
        phoneNumber: '+1234567890',
        latitude: 40.7128 + (Math.random() - 0.5) * 0.01, // Simulate movement
        longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
        accuracy: 10 + Math.random() * 20,
        timestamp: Date.now(),
        isSharing: true,
      }

      setLocation(mockLocation)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching location:', error)
      toast.error('Failed to fetch location')
      setLoading(false)
    }
  }

  const verifyPhone = () => {
    if (phoneVerification.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    // In production, verify phone number with backend
    setIsVerified(true)
    toast.success('Phone verified! Loading location...')
  }

  const refreshLocation = () => {
    setLoading(true)
    fetchLocation()
    toast.success('Location refreshed')
  }

  if (requiresVerification && !isVerified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Verification Required</h2>
            <p className="text-gray-600">
              Enter your phone number to access this location
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneVerification}
                onChange={(e) => setPhoneVerification(e.target.value.replace(/\D/g, ''))}
                placeholder="+1 234 567 8900"
                className="input"
                maxLength={15}
              />
            </div>
            <button onClick={verifyPhone} className="btn btn-primary w-full">
              Verify & Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading && !location) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading location...</p>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Not Found</h2>
          <p className="text-gray-600 mb-6">
            This tracking link may have expired or is invalid
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tracking {location.userName}
            </h1>
            <p className="text-gray-600">Real-time location tracking</p>
          </div>
          <button onClick={refreshLocation} className="btn btn-secondary">
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Live Location</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
            <div className="h-96 rounded-lg overflow-hidden">
              <LocationMap
                locations={[location]}
                center={[location.latitude, location.longitude]}
              />
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">User Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium text-gray-900">{location.userName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-medium text-gray-900">{location.phoneNumber}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Location Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Coordinates</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-medium">{Math.round(location.accuracy)}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary w-full justify-center"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </a>
              <a
                href={`https://maps.apple.com/?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary w-full justify-center"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Open in Apple Maps
              </a>
            </div>
          </div>

          {/* Update Info */}
          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Auto-refresh Active</h4>
                <p className="text-sm text-blue-700">
                  Location updates every 5 seconds automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
