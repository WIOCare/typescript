import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  phoneNumber: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (phoneNumber: string, otp: string, name?: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (phoneNumber: string, otp: string, name?: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In production, verify OTP with backend
        if (otp === '1234' || otp.length === 6) {
          const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            phoneNumber,
            name: name || phoneNumber,
          }
          set({ user, isAuthenticated: true })
        } else {
          throw new Error('Invalid OTP')
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
