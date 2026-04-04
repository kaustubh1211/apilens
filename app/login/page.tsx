"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/libs/authService"
import { FirebaseError } from "firebase/app"

type Mode = "signin" | "signup"
interface Props {
  onLoginSuccess?: () => void;
}
const getErrorMessage = (code: string): string => {
  const map: Record<string, string> = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/email-already-in-use": "Email already in use.",
    "auth/invalid-email": "Invalid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
  }
  return map[code] ?? "Something went wrong. Please try again."
}

export default function LoginPage({onLoginSuccess}:Props) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "signin") await signInWithEmail(email, password)
      else await signUpWithEmail(email, password)
      router.push("/app")
      if(onLoginSuccess){
        onLoginSuccess()
      }
    } catch (err) {
      if (err instanceof FirebaseError) setError(getErrorMessage(err.code))
      else setError("Unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      router.push("/app")
      if(onLoginSuccess){
        onLoginSuccess()
      }
    } catch (err) {
      if (err instanceof FirebaseError) setError(getErrorMessage(err.code))
      else setError("Google sign-in failed.")
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  bg-[#080b10]  text-white">


      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-1 lg:flex-none lg:w-[460px] items-center justify-center  px-6 py-10">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === "signin" ? "Sign in to your workspace" : "Start testing APIs for free"}
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 hover:border-blue-500/50 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-slate-500 border-t-blue-400 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-600">or continue with email</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <span className="mt-px shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                mode === "signin" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError("") }}
              className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}