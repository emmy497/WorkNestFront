import AuthLayout from "../Layout/AuthLayout";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { toast } from "../lib/toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // One piece of state per field.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Google already verifies the email, so unlike the form above this logs
  // the user straight in — no "check your inbox for a code" step.
  const signUpWithGoogle = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setGoogleSubmitting(true);

      try {
        await loginWithGoogle(tokenResponse.access_token);
        toast.success("Welcome to WorkNest");
        navigate("/find-jobs");
      } catch (err) {
        toast.error(
          "Could not sign you up with Google",
          err instanceof Error ? err.message : undefined
        );
      } finally {
        setGoogleSubmitting(false);
      }
    },
    onError: () => {
      toast.error("Could not sign you up with Google");
    },
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Check this here so the user gets told immediately, instead of
    // waiting for the server to reject it.
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Those passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await register(name, email, password);

      // The account exists but isn't verified yet, so we don't have a token.
      // Send them to the verify page, passing the email along in the
      // navigation state so they don't have to type it again.
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create your account",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-[20px] sm:rounded-[28px] p-6 sm:p-[32px] flex flex-col gap-6 sm:gap-[31px] w-full font-['Inter']"
      >
        <div className="text-start">
          <div className="font-extrabold text-[24px] leading-[34px] sm:text-[32px] sm:leading-[47.1px] tracking-[-1.39px] text-[#161320]">
            Create you account
          </div>
          <div className="font-normal text-[14px] leading-[22px] sm:text-[16px] sm:leading-[24px] tracking-[-0.5px] text-[#4C4C4F]">
            Set up your profile once and start applying to real roles.
          </div>
        </div>

        <div>
          <div className="mb-[8px] ">
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Full name
            </div>
            <input
              className="w-full h-[45px] rounded-[12.61px] border-[1.05px] border-[#ECEBF0] py-[14px] px-[15.76px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-[8px] ">
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Email address
            </div>
            <input
              className="w-full h-[45px] rounded-[12.61px] border-[1.05px] border-[#ECEBF0] py-[14px] px-[15.76px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-[8px]">
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Password
            </div>

            <div className="relative mb-[8px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-[45px] rounded-[12.61px] border-[1.05px] border-[#ECEBF0] py-[14px] pl-[15.76px] pr-[44px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#8B8798] transition hover:text-[#4B4757]"
              >
                {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="mt-[8px]">
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Confirm Password
            </div>

            <div className="relative mb-[8px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-[45px] rounded-[12.61px] border-[1.05px] border-[#ECEBF0] py-[14px] pl-[15.76px] pr-[44px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#8B8798] transition hover:text-[#4B4757]"
              >
                {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sign up and google buttons */}
        <div>

          {/* This must be a <button type="submit">, not a link.
              A link navigates away; only a submit button triggers
              the form's onSubmit handler. */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#6D4AFF] text-white py-[13.21px] px-[24.39px] w-full h-[44.42px] flex justify-center items-center rounded-[1015.4px] mb-[15px] text-[15px] font-semibold shadow-[0px_8.13px_22.36px_0px_rgba(109,74,255,0.3)] disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
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
            onClick={() => signUpWithGoogle()}
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
            Already have an account?
          </div>
          <NavLink
            to="/login"
            className="text-[#6D4AFF] text-[12px] font-normal"
          >
            Login
          </NavLink>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
