import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"
import { auth } from "./firebase"

const googleProvider = new GoogleAuthProvider()

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
  const result = await signInWithPopup(auth, googleProvider)
  await refreshAndStoreToken(result.user)
  return result.user
}

// ── Email / Password ───────────────────────────────────────────
export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  await refreshAndStoreToken(result.user)
  return result.user
}

export const signUpWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await refreshAndStoreToken(result.user)
  return result.user
}

// ── Sign out ───────────────────────────────────────────────────
export const signOut = async () => {
  await firebaseSignOut(auth)
  clearTokenFromSession()
}

// ── Auth state observer ────────────────────────────────────────
export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await refreshAndStoreToken(user) // keep token fresh
    } else {
      clearTokenFromSession()
    }
    callback(user)
  })