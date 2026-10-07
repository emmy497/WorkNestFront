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

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;

  sessionCheckFailed: boolean;
  retrySessionCheck: () => void;

  register: (name: string, email: string, password: string) => Promise<void>;

  verifyEmail: (email: string, otp: string) => Promise<void>;

  loginWithGoogle: (accessToken: string) => Promise<void>;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionCheckFailed, setSessionCheckFailed] = useState(false);

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

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
