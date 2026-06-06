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

type AuthContextValue = {
  user: User | null
  loading: boolean
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

  const loadSession = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null)
      setLoading(false)
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
    }
  }, [])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const signInCustomer = useCallback(async (email: string, password: string) => {
    const { token, user: u } = await customerLogin(email, password)
    setAuthToken(token)
    setUser(u)
    return u
  }, [])

  const signUpCustomer = useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string }) => {
      const { token, user: u } = await customerRegister(payload)
      setAuthToken(token)
      setUser(u)
      return u
    },
    [],
  )

  const signInOwner = useCallback(async (email: string, password: string) => {
    const { token, user: u } = await ownerLogin(email, password)
    setAuthToken(token)
    setUser(u)
    return u
  }, [])

  const signOut = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      /* offline ok */
    }
    clearAuthToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signInCustomer, signUpCustomer, signInOwner, signOut }),
    [user, loading, signInCustomer, signUpCustomer, signInOwner, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
