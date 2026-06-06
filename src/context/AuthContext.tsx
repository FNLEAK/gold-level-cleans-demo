import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearAuthToken,
  customerLogin,
  customerRegister,
  fetchMe,
  getAuthToken,
  logoutApi,
  ownerLogin,
  setAuthToken,
  type User,
} from '../lib/api'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import { fetchProfile, profileToUser } from '../lib/supabase-auth'

type AuthContextValue = {
  user: User | null
  loading: boolean
  profileReady: boolean
  signInCustomer: (email: string, password: string) => Promise<User>
  signUpCustomer: (payload: {
    name: string
    email: string
    password: string
    phone?: string
  }) => Promise<User>
  signInOwner: (email: string, password: string) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileReady, setProfileReady] = useState(!isSupabaseConfigured())

  const loadProfileFromSupabase = useCallback(async (userId: string) => {
    const profile = await fetchProfile(userId)
    if (!profile) return null
    const u = profileToUser(profile)
    setUser(u)
    setProfileReady(true)
    return u
  }, [])

  const syncSupabaseSession = useCallback(
    async (userId: string | undefined, clearUserOnMissingProfile = true) => {
      if (!userId) {
        setUser(null)
        setProfileReady(true)
        setLoading(false)
        return null
      }

      const profile = await fetchProfile(userId)
      if (profile) {
        const u = profileToUser(profile)
        setUser(u)
        setProfileReady(true)
        setLoading(false)
        return u
      }

      if (clearUserOnMissingProfile) {
        setUser(null)
      }
      setProfileReady(true)
      setLoading(false)
      return null
    },
    [],
  )

  const loadLegacySession = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null)
      setLoading(false)
      setProfileReady(true)
      return
    }
    try {
      const { user: me } = await fetchMe()
      setUser(me)
    } catch {
      clearAuthToken()
      setUser(null)
    } finally {
      setLoading(false)
      setProfileReady(true)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      loadLegacySession()
      return
    }

    const supabase = getSupabase()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await syncSupabaseSession(session?.user?.id)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Avoid calling Supabase from inside this callback synchronously — it deadlocks
      // and profile fetch fails, which was clearing the user right after sign-in.
      if (event === 'INITIAL_SESSION') return

      setTimeout(() => {
        void syncSupabaseSession(session?.user?.id)
      }, 0)
    })

    return () => subscription.unsubscribe()
  }, [loadLegacySession, loadProfileFromSupabase, syncSupabaseSession])

  const signInCustomer = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      const u = await loadProfileFromSupabase(data.user.id)
      if (!u) throw new Error('Profile not found')
      return u
    }
    const { token, user: u } = await customerLogin(email, password)
    setAuthToken(token)
    setUser(u)
    return u
  }, [loadProfileFromSupabase])

  const signUpCustomer = useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string }) => {
      if (isSupabaseConfigured()) {
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: { data: { full_name: payload.name } },
        })
        if (error) throw new Error(error.message)
        if (!data.user) throw new Error('Sign up failed')
        const u = await loadProfileFromSupabase(data.user.id)
        if (!u) throw new Error('Profile not found')
        return u
      }
      const { token, user: u } = await customerRegister(payload)
      setAuthToken(token)
      setUser(u)
      return u
    },
    [loadProfileFromSupabase],
  )

  const signInOwner = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      const profile = await fetchProfile(data.user.id)
      if (!profile || profile.role !== 'owner') {
        await supabase.auth.signOut()
        throw new Error('Access denied.')
      }
      const u = profileToUser(profile)
      setUser(u)
      setProfileReady(true)
      setLoading(false)
      return u
    }
    const { token, user: u } = await ownerLogin(email, password)
    setAuthToken(token)
    setUser(u)
    return u
  }, [])

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabase()
      await supabase.auth.signOut()
      setUser(null)
      setProfileReady(true)
      return
    }
    try {
      await logoutApi()
    } catch {
      /* offline ok */
    }
    clearAuthToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      profileReady,
      signInCustomer,
      signUpCustomer,
      signInOwner,
      signOut,
    }),
    [user, loading, profileReady, signInCustomer, signUpCustomer, signInOwner, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
