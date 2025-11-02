import { useState, useEffect } from 'react'
import { Share2, Copy, Clock, Users, Navigation, Link as LinkIcon } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useLocationStore, LocationData } from '../store/locationStore'
import toast from 'react-hot-toast'
import LocationMap from '../components/LocationMap'

export default function ShareLocation() {
  const { user } = useAuthStore()
  const { currentLocation, setCurrentLocation, addSharedLocation } = useLocationStore()
  const [duration, setDuration] = useState(60) // minutes
  const [allowedPhones, setAllowedPhones] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [trackingId, setTrackingId] = useState('')

  useEffect(() => {
    // Get current location when component mounts
    if (!currentLocation) {
      getCurrentLocation()
    }
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: LocationData = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user?.id || '',
          userName: user?.name || '',
          phoneNumber: user?.phoneNumber || '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
          isSharing: false,
        }
        setCurrentLocation(location)
      },
      (error) => {
        console.error('Error getting location:', error)
        toast.error('Failed to get location. Please try again.')
      }
    )
  }

  const addAllowedPhone = () => {
    if (phoneInput.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    if (allowedPhones.includes(phoneInput)) {
      toast.error('Phone number already added')
      return
    }
    setAllowedPhones([...allowedPhones, phoneInput])
    setPhoneInput('')
    toast.success('Phone number added')
  }

  const removeAllowedPhone = (phone: string) => {
    setAllowedPhones(allowedPhones.filter((p) => p !== phone))
  }

  const startSharing = () => {
    if (!currentLocation) {
      toast.error('Please allow location access first')
      getCurrentLocation()
      return
    }

    const id = Math.random().toString(36).substr(2, 9)
    setTrackingId(id)
    const link = `${window.location.origin}/track/${id}`
    setShareLink(link)
    setIsSharing(true)

    const sharedLocation: LocationData = {
      ...currentLocation,
      id,
      isSharing: true,
    }
    addSharedLocation(sharedLocation)

    // Start live tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          ...sharedLocation,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        })
      },
      (error) => {
        console.error('Error watching location:', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    )

    // Auto-stop after duration
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId)
      setIsSharing(false)
      toast.success('Location sharing ended')
    }, duration * 60 * 1000)

    toast.success('Location sharing started!')
  }

  const stopSharing = () => {
    setIsSharing(false)
    setShareLink('')
    toast.success('Location sharing stopped')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Location</h1>
        <p className="text-gray-600">Generate a secure link to share your real-time location</p>
      </div>

      {!isSharing ? (
        <div className="space-y-6">
          {/* Current Location Preview */}
          {currentLocation && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Current Location</h2>
              <div className="h-64 rounded-lg overflow-hidden mb-4">
                <LocationMap
                  locations={[currentLocation]}
                  center={[currentLocation.latitude, currentLocation.longitude]}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation className="w-4 h-4" />
                <span>
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          )}

          {/* Sharing Settings */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sharing Settings</h2>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours</option>
                <option value={1440}>24 hours</option>
              </select>
            </div>

            {/* Allowed Phone Numbers (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-2" />
                Allowed Phone Numbers (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="+1 234 567 8900"
                  className="input flex-1"
                  maxLength={15}
                />
                <button onClick={addAllowedPhone} className="btn btn-secondary">
                  Add
                </button>
              </div>
              {allowedPhones.length > 0 && (
                <div className="space-y-2">
                  {allowedPhones.map((phone) => (
                    <div
                      key={phone}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">{phone}</span>
                      <button
                        onClick={() => removeAllowedPhone(phone)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Leave empty to allow anyone with the link to track
              </p>
            </div>

            <button onClick={startSharing} className="btn btn-primary w-full py-3">
              <Share2 className="w-5 h-5 mr-2" />
              Start Sharing Location
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live Tracking Map */}
          {currentLocation && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Live Tracking Active</h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Live</span>
                </div>
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <LocationMap
                  locations={[currentLocation]}
                  center={[currentLocation.latitude, currentLocation.longitude]}
                />
              </div>
            </div>
          )}

          {/* Share Link */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Link</h2>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center gap-3 mb-3">
                <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <code className="text-sm flex-1 truncate">{shareLink}</code>
                <button onClick={copyLink} className="btn btn-secondary text-sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500">
                This link will expire in {duration} minutes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  const text = `Track my location: ${shareLink}`
                  if (navigator.share) {
                    navigator.share({ title: 'Track My Location', text, url: shareLink })
                  } else {
                    copyLink()
                  }
                }}
                className="btn btn-secondary"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button onClick={stopSharing} className="btn bg-red-600 text-white hover:bg-red-700">
                Stop Sharing
              </button>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Tracking Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking ID:</span>
                <span className="font-mono font-medium">{trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allowed Users:</span>
                <span className="font-medium">
                  {allowedPhones.length > 0 ? `${allowedPhones.length} phone(s)` : 'Anyone with link'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
