import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Share2, Clock, Navigation, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useLocationStore, LocationData } from '../store/locationStore'
import toast from 'react-hot-toast'
import LocationMap from '../components/LocationMap'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { currentLocation, sharedLocations, setCurrentLocation } = useLocationStore()
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [loadingLocation, setLoadingLocation] = useState(false)

  useEffect(() => {
    checkLocationPermission()
  }, [])

  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' })
        setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt')

        result.addEventListener('change', () => {
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt')
        })
      } catch (error) {
        console.error('Error checking permission:', error)
      }
    }
  }

  const requestLocation = () => {
    setLoadingLocation(true)
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      setLoadingLocation(false)
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
        setPermissionStatus('granted')
        toast.success('Location updated successfully!')
        setLoadingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionStatus('denied')
          toast.error('Location permission denied. Please enable it in your browser settings.')
        } else {
          toast.error('Failed to get location. Please try again.')
        }
        setLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your location sharing and track your friends
        </p>
      </div>

      {/* Location Permission Status */}
      {permissionStatus !== 'granted' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-900 mb-1">Location Permission Required</h3>
            <p className="text-sm text-yellow-700 mb-3">
              {permissionStatus === 'denied'
                ? 'Location access is denied. Please enable it in your browser settings to use location features.'
                : 'We need your permission to access your location for tracking and sharing features.'}
            </p>
            {permissionStatus === 'prompt' && (
              <button onClick={requestLocation} className="btn btn-primary text-sm">
                Grant Permission
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<MapPin className="w-6 h-6" />}
          title="Current Location"
          value={currentLocation ? 'Active' : 'Not Set'}
          subtitle={
            currentLocation
              ? `Accuracy: ${Math.round(currentLocation.accuracy)}m`
              : 'Click below to get location'
          }
          color="blue"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Shared Locations"
          value={sharedLocations.length.toString()}
          subtitle="Active shares"
          color="green"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="Last Update"
          value={
            currentLocation
              ? new Date(currentLocation.timestamp).toLocaleTimeString()
              : 'Never'
          }
          subtitle={currentLocation ? new Date(currentLocation.timestamp).toLocaleDateString() : ''}
          color="purple"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={requestLocation}
          disabled={loadingLocation}
          className="btn btn-primary h-20 flex items-center justify-center gap-3 text-lg"
        >
          <Navigation className="w-6 h-6" />
          {loadingLocation ? 'Getting Location...' : 'Get Current Location'}
        </button>
        <Link
          to="/share"
          className="btn bg-green-600 text-white hover:bg-green-700 h-20 flex items-center justify-center gap-3 text-lg"
        >
          <Share2 className="w-6 h-6" />
          Share My Location
        </Link>
      </div>

      {/* Map Section */}
      {currentLocation && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Location</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <LocationMap locations={[currentLocation]} center={[currentLocation.latitude, currentLocation.longitude]} />
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Latitude:</span>
                <span className="ml-2 font-mono font-medium">{currentLocation.latitude.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-gray-600">Longitude:</span>
                <span className="ml-2 font-mono font-medium">{currentLocation.longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Locations */}
      {sharedLocations.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Shared Locations</h2>
          <div className="space-y-3">
            {sharedLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  color: 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

function LocationCard({ location }: { location: LocationData }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{location.userName}</div>
          <div className="text-sm text-gray-500">{location.phoneNumber}</div>
        </div>
      </div>
      <Link
        to={`/track/${location.id}`}
        className="btn btn-secondary text-sm"
      >
        View on Map
      </Link>
    </div>
  )
}
