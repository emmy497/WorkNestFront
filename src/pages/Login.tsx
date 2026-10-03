import { useEffect, useState, type FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import AuthLayout from "../Layout/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { NeedsVerificationError } from "../api/auth";
import { toast } from "../lib/toast";

const Login = () => {
  // Grab the login function from our AuthContext.
  const { login, loginWithGoogle } = useAuth();

  // Lets us send the user to another page after a successful login.
  const navigate = useNavigate();

  // The reset-password flow sends a success message here when it finishes.
  // The Apply-gate modal sends `from` — where to land after logging in,
  // e.g. back on the job application that prompted the login.
  const location = useLocation();
  const state = location.state as { notice?: string; from?: string } | null;
  const noticeFromRedirect = state?.notice;
  const from = state?.from || "/find-jobs";

  // Controlled inputs: React state holds the value, not the DOM.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Inline, field-level messages — set on a failed submit attempt, cleared
  // the moment that field is edited again.
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Fires when Google hands back an access token from the popup. Google has
  // already confirmed the user's identity — we just pass the token on to
  // our server, which double-checks it before trusting it.
  const signInWithGoogle = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setGoogleSubmitting(true);

      try {
        await loginWithGoogle(tokenResponse.access_token);
        toast.success("Welcome back");
        navigate(from);
      } catch (err) {
        toast.error(
          "Could not sign you in with Google",
          err instanceof Error ? err.message : undefined
        );
      } finally {
        setGoogleSubmitting(false);
      }
    },
    onError: () => {
      toast.error("Could not sign you in with Google");
    },
  });

  // Show the "Password updated" message from the reset flow as a toast.
  // It's in a useEffect so it fires once when the page loads, not on
  // every re-render.
  useEffect(() => {
    if (noticeFromRedirect) {
      toast.success(noticeFromRedirect);
    }
  }, [noticeFromRedirect]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Stops the browser reloading the page, which is its default
    // behaviour for a form submit.
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Email address is required";
    if (!password) nextErrors.password = "Password is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate(from); // logged in — back to wherever they were headed
    } catch (err) {
      // Special case: the password was right, but they never confirmed
      // their email. Send them straight to the verify page instead of
      // leaving them stuck on an error message.
      if (err instanceof NeedsVerificationError) {
        toast.info("Verify your email", "We sent you a new code.");
        navigate("/verify-email", { state: { email: err.email, from } });
        return;
      }

      // Our api/auth.ts throws an Error carrying the server's message,
      // so this shows "Invalid email or password" rather than something generic.
      toast.error(
        "Could not sign you in",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      // Runs whether it worked or failed, so the button never stays stuck.
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#FFFFFF] rounded-[20px] sm:rounded-[28px] p-6 sm:p-[32px] flex flex-col gap-6 sm:gap-[31px] w-full font-['Inter']"
      >
        <div className="text-start">
          <div className="font-extrabold text-[24px] leading-[34px] sm:text-[32px] sm:leading-[47.1px] tracking-[-1.39px] text-[#161320]">
            Welcome back
          </div>
          <div className="font-normal text-[14px] leading-[22px] sm:text-[16px] sm:leading-[24px] tracking-[-0.5px] text-[#4C4C4F]">
            Sign in to your account to continue
          </div>
        </div>

        {/* email and password input */}
        <div>
          <div>
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Email address
            </div>
            <input
              className={`w-full h-[45px] rounded-[12.61px] border-[1.05px] py-[14px] px-[15.76px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] ${
                errors.email ? "border-[#D14343]" : "border-[#ECEBF0] focus:border-[#6D4AFF]"
              }`}
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {errors.email && (
              <p className="mt-[6px] text-[12px] text-[#D14343]">{errors.email}</p>
            )}
          </div>

          <div className="mt-[16px]">
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Password
            </div>
            <input
              type="password"
              placeholder="Enter password"
              className={`w-full h-[45px] rounded-[12.61px] border-[1.05px] py-[14px] px-[15.76px] mb-[8px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] ${
                errors.password ? "border-[#D14343]" : "border-[#ECEBF0] focus:border-[#6D4AFF]"
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            {errors.password && (
              <p className="mb-[8px] text-[12px] text-[#D14343]">{errors.password}</p>
            )}
          </div>

          <NavLink
            to="/forgot-password"
            className="flex justify-end text-[13px] sm:text-[14px] text-[#6D4AFF]"
          >
            Forgot password?
          </NavLink>
        </div>

        {/* Sign in and google buttons */}
        <div>
          {/* A success message passed over from the reset-password flow */}
          {/* Messages now appear as toasts instead of inline text —
              see handleSubmit above. */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#6D4AFF] text-white py-[13.21px] px-[24.39px] w-full h-[44.42px] flex justify-center items-center rounded-[1015.4px] mb-[15px] text-[15px] font-semibold shadow-[0px_8.13px_22.36px_0px_rgba(109,74,255,0.3)] disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          {/* or */}
          <div className="flex items-center gap-[5px] mb-[15px]">
            <div className="h-[2.08px] flex-1 bg-[linear-gradient(90deg,rgba(135,135,137,0)_11.88%,#878789_100%)]" />
            <span className="font-normal text-[12px] text-[#878789]">Or</span>
            <div className="h-[2.08px] flex-1 bg-[linear-gradient(270deg,rgba(135,135,137,0)_11.88%,#878789_100%)]" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            disabled={googleSubmitting}
            className="flex justify-center items-center gap-[10px] w-full border-[1px] border-[#6D4AFF] h-[46px] px-4 py-[14px] rounded-[100px] disabled:opacity-60"
          >
            <img
              src="/images/Google.png"
              className="w-[18px] shrink-0"
              alt=""
            />
            <div className="font-semibold text-[14px] sm:text-[15px] text-[#6D4AFF] whitespace-nowrap">
              {googleSubmitting ? "Signing in..." : "Continue with Google"}
            </div>
          </button>
        </div>

        {/* Create Account */}
        <div className="flex flex-wrap items-center justify-center gap-[8px]">
          <div className="font-normal text-[12px] text-[#878789]">
            Don't have an account?
          </div>
          <NavLink
            to="/signup"
            className="text-[#6D4AFF] text-[12px] font-normal"
          >
            Create Account
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
