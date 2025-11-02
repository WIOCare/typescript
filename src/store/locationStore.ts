import { create } from 'zustand'

export interface LocationData {
  id: string
  userId: string
  userName: string
  phoneNumber: string
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
  isSharing: boolean
}

interface LocationState {
  currentLocation: LocationData | null
  trackedLocations: LocationData[]
  sharedLocations: LocationData[]
  isTracking: boolean
  setCurrentLocation: (location: LocationData) => void
  addTrackedLocation: (location: LocationData) => void
  addSharedLocation: (location: LocationData) => void
  removeSharedLocation: (id: string) => void
  setIsTracking: (isTracking: boolean) => void
  updateLocation: (latitude: number, longitude: number, accuracy: number) => void
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  trackedLocations: [],
  sharedLocations: [],
  isTracking: false,

  setCurrentLocation: (location) => set({ currentLocation: location }),

  addTrackedLocation: (location) =>
    set((state) => ({
      trackedLocations: [...state.trackedLocations, location],
    })),

  addSharedLocation: (location) =>
    set((state) => ({
      sharedLocations: [...state.sharedLocations, location],
    })),

  removeSharedLocation: (id) =>
    set((state) => ({
      sharedLocations: state.sharedLocations.filter((loc) => loc.id !== id),
    })),

  setIsTracking: (isTracking) => set({ isTracking }),

  updateLocation: (latitude, longitude, accuracy) => {
    const current = get().currentLocation
    if (current) {
      set({
        currentLocation: {
          ...current,
          latitude,
          longitude,
          accuracy,
          timestamp: Date.now(),
        },
      })
    }
  },
}))
