import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth"
import { auth } from "./firebase"

const googleProvider = new GoogleAuthProvider()

// ── Guard helper ───────────────────────────────────────────────
const requireAuth = (): Auth => {
  if (!auth) throw new Error("Auth not initialized")
  return auth
}

// ── Token helpers ──────────────────────────────────────────────
const TOKEN_KEY = "apilense_token"

export const saveTokenToSession = (token: string) =>
  sessionStorage.setItem(TOKEN_KEY, token)

export const getTokenFromSession = (): string | null =>
  sessionStorage.getItem(TOKEN_KEY)

export const clearTokenFromSession = () =>
  sessionStorage.removeItem(TOKEN_KEY)

// ── Refresh + persist token ────────────────────────────────────
export const refreshAndStoreToken = async (user: User): Promise<string> => {
  const token = await user.getIdToken(true)
  saveTokenToSession(token)
  return token
}

// ── Google OAuth ───────────────────────────────────────────────
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(requireAuth(), googleProvider)
  await refreshAndStoreToken(result.user)
  return result.user
}

// ── Email / Password ───────────────────────────────────────────
export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(requireAuth(), email, password)
  await refreshAndStoreToken(result.user)
  return result.user
}

export const signUpWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(requireAuth(), email, password)
  await refreshAndStoreToken(result.user)
  return result.user
}

// ── Sign out ───────────────────────────────────────────────────
export const signOut = async () => {
  await firebaseSignOut(requireAuth())
  clearTokenFromSession()
}

// ── Auth state observer ────────────────────────────────────────
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await refreshAndStoreToken(user)
    } else {
      clearTokenFromSession()
    }
    callback(user)
  })
}