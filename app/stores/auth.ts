import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async registerUser(payload: {
      email: string
      password: string
      fullname: string
      username: string
    }) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const auth = getAuth(app)
        const db = getFirestore(app)

        if (!auth || !db) throw new Error('Firebase not Initialized!')

        const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password)
        const user = userCredential.user
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.fullname)}&background=random`

        await updateProfile(user, {
          displayName: payload.fullname,
          photoURL: defaultAvatar
        })

        await setDoc(doc(db, 'users', user.uid), {
          fullname: payload.fullname,
          username: payload.username,
          email: payload.email,
          photoUrl: defaultAvatar,
          createdAt: new Date().toISOString()
        })

        return navigateTo('/')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Registration error:', err)
        if (err.code === 'auth/email-already-in-use') {
          this.error = 'Email already in use.'
        } else if (err.code?.includes('firestore')) {
          this.error = 'Failed to save user data. Registration may have succeeded but user profile was not created properly.'
        } else {
          this.error = err.message || 'Registration failed'
        }

        throw err
      } finally {
        this.isLoading = false
      }
    },

    async loginUser(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const auth = getAuth(app)

        if (!auth) throw new Error('Firebase Auth not Initialized!')
        await signInWithEmailAndPassword(auth, email, password)
        return navigateTo('/')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    async logoutUser() {
      const app = useFirebaseApp()
      const auth = getAuth(app)

      if (auth) {
        await signOut(auth)
        return navigateTo('/')
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const auth = getAuth(app)
        const user = auth.currentUser

        if (!user) {
          throw new Error('No user is currently logged in')
        }

        // Re-authenticate user before changing password
        const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth')
        const credential = EmailAuthProvider.credential(user.email!, currentPassword)
        await reauthenticateWithCredential(user, credential)

        // Change password
        await updatePassword(user, newPassword)

        return true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Change password error:', err)
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
