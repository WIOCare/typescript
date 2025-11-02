import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { LocationData } from '../store/locationStore'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icon for active tracking
const activeMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface LocationMapProps {
  locations: LocationData[]
  center?: [number, number]
  zoom?: number
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

export default function LocationMap({ locations, center, zoom = 13 }: LocationMapProps) {
  const mapCenter = center || (locations.length > 0
    ? [locations[0].latitude, locations[0].longitude] as [number, number]
    : [40.7128, -74.0060] as [number, number])

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={mapCenter} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={location.isSharing ? activeMarkerIcon : undefined}
        >
          <Popup>
            <div className="p-2">
              <div className="font-semibold text-gray-900 mb-1">{location.userName}</div>
              <div className="text-xs text-gray-600 mb-2">{location.phoneNumber}</div>
              <div className="text-xs space-y-1">
                <div>
                  <span className="text-gray-500">Lat:</span>{' '}
                  <span className="font-mono">{location.latitude.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Lng:</span>{' '}
                  <span className="font-mono">{location.longitude.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Accuracy:</span>{' '}
                  <span>{Math.round(location.accuracy)}m</span>
                </div>
                <div>
                  <span className="text-gray-500">Updated:</span>{' '}
                  <span>{new Date(location.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
