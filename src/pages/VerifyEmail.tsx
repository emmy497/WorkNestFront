import { useEffect, useState, type FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import OtpInput from "../components/OtpInput";
import { useAuth } from "../context/AuthContext";
import { resendOtpRequest } from "../api/auth";
import { toast } from "../lib/toast";

const RESEND_COOLDOWN_SECONDS = 30;

// "john@gmail.com" -> "j***@gmail.com" — enough to confirm it's the right
// inbox without showing the full address on screen.
function maskEmail(rawEmail: string) {
  const [local, domain] = rawEmail.split("@");
  if (!local || !domain) return rawEmail;
  return `${local[0]}***@${domain}`;
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  // The SignUp (and Login, for the "needs verification" case) pages send
  // the email — and possibly a `from` to return to afterwards — across
  // when they navigate here. We read both back out of location.state.
  const location = useLocation();
  const routeState = location.state as { email?: string; from?: string } | null;
  const emailFromSignup = routeState?.email;
  const from = routeState?.from || "/find-jobs";

  // If someone lands here directly with no email in the state, we let them
  // type it in rather than showing a broken page.
  const [email, setEmail] = useState(emailFromSignup || "");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; otp?: string }>({});

  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Email address is required";
    if (otp.length !== 6) nextErrors.otp = "Enter the full 6-digit code";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }

    setSubmitting(true);

    try {
      await verifyEmail(email, otp);
      // Verified and logged in — back to wherever they were headed.
      navigate(from);
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
      const data = await resendOtpRequest(email);
      toast.info(data.message);
      setOtp(""); // clear the old code from the box
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not resend the code",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#FFFFFF] rounded-[20px] sm:rounded-[28px] p-6 sm:p-[32px] flex flex-col gap-6 sm:gap-[28px] w-full font-['Inter']"
      >
        <div className="text-start">
          <div className="font-extrabold text-[24px] leading-[34px] sm:text-[32px] sm:leading-[40px] tracking-[-1.39px] text-[#161320]">
            Verify your email
          </div>
          <div className="mt-[6px] font-normal text-[14px] leading-[22px] sm:text-[16px] sm:leading-[24px] tracking-[-0.5px] text-[#4C4C4F]">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold text-[#161320]">
              {email ? maskEmail(email) : "your email"}
            </span>
          </div>
        </div>

        {/* Only shown if they arrived here without an email attached */}
        {!emailFromSignup && (
          <div>
            <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
              Email address
            </div>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`w-full h-[45px] rounded-[12.61px] border-[1.05px] py-[14px] px-[15.76px] text-[14px] text-[#161320] outline-none transition placeholder:text-[#8B8798] ${
                errors.email ? "border-[#D14343]" : "border-[#ECEBF0] focus:border-[#6D4AFF]"
              }`}
            />
            {errors.email && <p className="mt-[6px] text-[12px] text-[#D14343]">{errors.email}</p>}
          </div>
        )}

        <div>
          <div className="mb-[8px] font-medium text-[13.66px] leading-[20.48px] text-[#4B4757]">
            Verification code
          </div>
          <OtpInput value={otp} onChange={setOtp} />
          {errors.otp && <p className="mt-[6px] text-[12px] text-[#D14343]">{errors.otp}</p>}
        </div>

        <div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#6D4AFF] text-white py-[13.21px] px-[24.39px] w-full h-[44.42px] flex justify-center items-center rounded-[1015.4px] text-[15px] font-semibold shadow-[0px_8.13px_22.36px_0px_rgba(109,74,255,0.3)] disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify"}
          </button>

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
                  disabled={resending || !email}
                  className="text-[12px] font-medium text-[#6D4AFF] hover:underline disabled:opacity-60"
                >
                  {resending ? "Sending..." : "Resend"}
                </button>
              </>
            )}
          </div>
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

export default VerifyEmail;
