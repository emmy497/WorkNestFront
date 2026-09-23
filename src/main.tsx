import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext.tsx'
import { SavedJobsProvider } from './context/SavedJobsContext.tsx'

// react-toastify needs its stylesheet imported once, anywhere in the app.
// Without this line the toasts appear as unstyled text in the corner.
import 'react-toastify/dist/ReactToastify.css'
import Toaster from './components/Toaster.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Lets any component call useGoogleLogin() for "Continue with Google". */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        {/* AuthProvider goes INSIDE BrowserRouter so anything using auth
            can also use routing (like redirecting after login). */}
        <AuthProvider>
          {/* SavedJobsProvider goes INSIDE AuthProvider because it needs to
              know whether someone is logged in before it can fetch anything. */}
          <SavedJobsProvider>
            <App />
          </SavedJobsProvider>

          {/* One Toaster for the whole app. Calling toast() anywhere sends a
              message here to be displayed. All its styling and the mobile
              positioning live in components/Toaster.tsx. */}
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
