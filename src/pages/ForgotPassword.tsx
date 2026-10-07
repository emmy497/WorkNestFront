import { useEffect, useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthLayout from "../Layout/AuthLayout";
import OtpInput from "../components/OtpInput";
import {
  forgotPasswordRequest,
  verifyResetOtpRequest,
  resetPasswordRequest,
} from "../api/auth";
import { toast } from "../lib/toast";

const RESEND_COOLDOWN_SECONDS = 30;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type Step = "email" | "otp" | "reset";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Email address is required" });
      return;
    }
    setErrors({});

    setSubmitting(true);

    try {
      await forgotPasswordRequest(email);
      setStep("otp");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send the code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrors({ otp: "Enter the full 6-digit code" });
      toast.error("Enter the full 6-digit code");
      return;
    }
    setErrors({});

    setSubmitting(true);

    try {
      await verifyResetOtpRequest(email, otp);
      setStep("reset");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not verify that code",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResending(true);

    try {
      const data = await forgotPasswordRequest(email);
      toast.info(data.message);
      setOtp("");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not resend the code",
      );
    } finally {
      setResending(false);
    }
  }

  async function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!newPassword) {
      nextErrors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Those passwords do not match";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }

    setSubmitting(true);

    try {
      await resetPasswordRequest(email, otp, newPassword);
      navigate("/login", {
        state: { notice: "Password updated. You can log in now." },
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not reset your password",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full h-[45px] rounded-[12.61px] border-[1.05px] border-[#ECEBF0] py-[14px] px-[15.76px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] focus:border-[#6D4AFF]";

  const headingText =
    step === "email"
      ? "Forgot password?"
      : step === "otp"
        ? "Verify your email"
        : "Reset your password";

  const subtitleText =
    step === "email"
      ? "Enter your email and we'll send you a verification code"
      : step === "otp"
        ? `We've sent a 6-digit code to ${email}`
        : "Enter a new password and ensure you don't forget it";

  return (
    <AuthLayout>
      <form
        onSubmit={
          step === "email"
            ? handleSendCode
            : step === "otp"
              ? handleVerifyOtp
              : handleReset
        }
        noValidate
        className="bg-[#FFFFFF] rounded-[20px] sm:rounded-[28px] p-6 sm:p-[32px] flex flex-col gap-6 sm:gap-[28px] w-full font-['Inter']"
      >
        <div className="text-start">
          <div className="font-extrabold text-[24px] leading-[34px] sm:text-[32px] sm:leading-[40px] tracking-[-1.39px] text-[#161320]">
            {headingText}
          </div>
          <div className="mt-[6px] font-normal text-[14px] leading-[22px] sm:text-[16px] sm:leading-[24px] tracking-[-0.5px] text-[#4C4C4F]">
            {subtitleText}
          </div>
        </div>

        {step === "email" && (
          <div>
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Email address
            </div>
            <input
              className={`${inputClass} ${errors.email ? "border-[#D14343] focus:border-[#D14343]" : ""}`}
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {errors.email && <p className="mt-[6px] text-[12px] text-[#D14343]">{errors.email}</p>}
          </div>
        )}

        {step === "otp" && (
          <div>
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Verification code
            </div>
            <OtpInput value={otp} onChange={setOtp} />
            {errors.otp && <p className="mt-[6px] text-[12px] text-[#D14343]">{errors.otp}</p>}
          </div>
        )}

        {step === "reset" && (
          <div className="flex flex-col gap-[16px]">
            <div>
              <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
                New password
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword)
                      setErrors((prev) => ({ ...prev, newPassword: undefined }));
                  }}
                  className={`${inputClass} pr-[44px] ${
                    errors.newPassword ? "border-[#D14343] focus:border-[#D14343]" : ""
                  }`}
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
              {errors.newPassword && (
                <p className="mt-[6px] text-[12px] text-[#D14343]">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
                Confirm password
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  className={`${inputClass} pr-[44px] ${
                    errors.confirmPassword ? "border-[#D14343] focus:border-[#D14343]" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[#8B8798] transition hover:text-[#4B4757]"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-[6px] text-[12px] text-[#D14343]">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}

        <div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#6D4AFF] text-white py-[13.21px] px-[24.39px] w-full h-[44.42px] flex justify-center items-center rounded-[1015.4px] text-[15px] font-semibold shadow-[0px_8.13px_22.36px_0px_rgba(109,74,255,0.3)] disabled:opacity-60"
          >
            {submitting
              ? "Please wait..."
              : step === "email"
                ? "Send verification code"
                : step === "otp"
                  ? "Verify"
                  : "Reset password"}
          </button>

          {step === "otp" && (
            <div className="mt-[16px] flex flex-wrap items-center justify-center gap-[6px]">
              {secondsLeft > 0 ? (
                <span className="text-[12px] text-[#878789]">
                  Resend code in{" "}
                  <span className="font-semibold text-[#6D4AFF]">
                    {formatCountdown(secondsLeft)}
                  </span>
                </span>
              ) : (
                <>
                  <span className="text-[12px] text-[#878789]">
                    Didn't receive a code?
                  </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-[12px] font-medium text-[#6D4AFF] hover:underline disabled:opacity-60"
                  >
                    {resending ? "Sending..." : "Resend"}
                  </button>
                </>
              )}
            </div>
          )}

          {step === "otp" && (
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
              }}
              className="mt-[14px] w-full text-center text-[12px] text-[#878789] hover:text-[#4B4757]"
            >
              Use a different email
            </button>
          )}
        </div>

        <NavLink
          to="/login"
          className="w-full flex justify-center items-center font-normal text-[12px] text-[#6D4AFF]"
        >
          Back to Sign in
        </NavLink>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
