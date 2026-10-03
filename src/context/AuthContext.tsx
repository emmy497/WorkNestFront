import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import {
  loginRequest,
  registerRequest,
  verifyEmailRequest,
  googleAuthRequest,
  getMeRequest,
  saveToken,
  getToken,
  clearToken,
  type User,
} from "../api/auth";

// ---------------------------------------------------------------------------
// Why a Context?
//
// Lots of components need to know who is logged in — the navbar, the login
// page, any protected page. Passing a `user` prop down through every layer
// would be painful. A Context lets any component inside the provider reach
// the value directly.
// ---------------------------------------------------------------------------

// Everything the rest of the app can use.
type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean; // true while we check the saved token on first load
  login: (email: string, password: string) => Promise<void>;

  // True when the on-load "is this token still good?" check couldn't get a
  // definitive answer (dropped connection, a cold-starting backend) rather
  // than being told outright that the token is invalid. ProtectedRoute uses
  // this to offer a retry instead of bouncing someone to /login who may well
  // still be logged in.
  sessionCheckFailed: boolean;
  retrySessionCheck: () => void;

  // Creates the account and emails a code. Does NOT log you in — that
  // happens in verifyEmail below.
  register: (name: string, email: string, password: string) => Promise<void>;

  // Confirms the emailed code, and THEN logs you in.
  verifyEmail: (email: string, otp: string) => Promise<void>;

  // Signs up or logs in with Google — Google already verified the email,
  // so unlike register() this logs you in immediately, no OTP step.
  loginWithGoogle: (accessToken: string) => Promise<void>;

  logout: () => void;
};

// The default is `undefined` on purpose. There is no sensible "empty" user
// and login function, so we admit that — and the useAuth hook below turns
// that honesty into a helpful error message.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionCheckFailed, setSessionCheckFailed] = useState(false);

  // The token lives in localStorage, so it survives a refresh. But it might
  // have expired since last time, so we ask the server "is this still valid,
  // and who is it?" before trusting it.
  //
  // On mobile especially, this check can fail for reasons that have nothing
  // to do with the token itself — a dropped connection, a free-tier backend
  // cold-starting — so only a real 401 (the server explicitly rejecting the
  // token) counts as "log this person out". Anything else gets a few retries
  // before we give up, and even then we keep the token and just flag that we
  // couldn't confirm it, instead of silently wiping a still-valid session.
  async function checkSession() {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    setSessionCheckFailed(false);

    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const data = await getMeRequest(token);
        setUser(data.user);
        setLoading(false);
        return;
      } catch (err) {
        const status = axios.isAxiosError(err) ? err.response?.status : undefined;

        if (status === 401) {
          clearToken();
          setLoading(false);
          return;
        }

        if (attempt < MAX_ATTEMPTS) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
        }
      }
    }

    setSessionCheckFailed(true);
    setLoading(false);
  }

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function retrySessionCheck() {
    setLoading(true);
    checkSession();
  }

  async function login(email: string, password: string) {
    const data = await loginRequest(email, password);
    saveToken(data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    // No token comes back here — the account exists but isn't verified yet.
    // If the code is wrong or never entered, they simply can't log in.
    await registerRequest(name, email, password);
  }

  async function verifyEmail(email: string, otp: string) {
    const data = await verifyEmailRequest(email, otp);
    saveToken(data.token);
    setUser(data.user);
  }

  async function loginWithGoogle(accessToken: string) {
    const data = await googleAuthRequest(accessToken);
    saveToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    isLoggedIn: user !== null,
    loading,
    sessionCheckFailed,
    retrySessionCheck,
    login,
    register,
    verifyEmail,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ---------------------------------------------------------------------------
// Components use this instead of useContext directly.
//
// The check below means that if someone forgets to wrap the app in
// <AuthProvider>, they get a clear message saying exactly that — instead of
// a confusing "cannot read properties of undefined".
// ---------------------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
