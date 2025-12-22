import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore'

export interface UserProfile {
  fullName?: string
  username?: string
  email?: string
  phone?: string
  photoUrl?: string
  createdAt?: string | Date
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null as UserProfile | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.profile
    },

    getFullName: (state) => {
      return state.profile?.fullName || ''
    },

    getUsername: (state) => {
      return state.profile?.username || ''
    }
  },

  actions: {
    async fetchProfile() {
      this.isLoading = true
      this.error = null

      try {
        const user = useCurrentUser()
        if (!user?.value) {
          throw new Error('User not authenticated')
        }

        const app = useFirebaseApp()
        const db = getFirestore(app)
        const authUser = user.value

        // Ambil data dari Firestore
        const userDocRef = doc(db, 'users', authUser.uid)
        const userDocSnap = await getDoc(userDocRef)

        let firestoreData: Partial<UserProfile> = {}
        if (userDocSnap.exists()) {
          firestoreData = userDocSnap.data() as Partial<UserProfile>
        } else {
          this.error = 'User profile not found'
        }

        // Gabungkan dengan data dari auth (displayName dan photoURL)
        this.profile = {
          ...firestoreData,
          fullName: authUser.displayName || firestoreData.fullName || '',
          photoUrl: authUser.photoURL || firestoreData.photoUrl || ''
        } as UserProfile
      } catch (err) {
        console.error('Error fetching profile:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(profileData: Partial<UserProfile>) {
      this.isLoading = true
      this.error = null

      try {
        const user = useCurrentUser()
        if (!user?.value) {
          throw new Error('User not authenticated')
        }

        const app = useFirebaseApp()
        const db = getFirestore(app)
        const authUser = user.value

        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, profileData)

        const { updateProfile } = await import('firebase/auth')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = {}

        if (profileData.fullName) {
          updates.displayName = profileData.fullName
        }

        if (profileData.photoUrl) {
          updates.photoURL = profileData.photoUrl
        }

        if (Object.keys(updates).length > 0) {
          await updateProfile(authUser, updates)
        }

        // Update profil lokal
        if (this.profile) {
          this.profile = { ...this.profile, ...profileData }
        } else {
          await this.fetchProfile()
        }
      } catch (err) {
        console.error('Error updating profile:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
