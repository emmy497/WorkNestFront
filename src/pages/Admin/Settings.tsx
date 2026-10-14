import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const card = "rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]";
const label = "font-['Inter'] text-[12px] font-semibold tracking-[0.06em] text-[#8B8798]";
const value = "font-['Inter'] text-[14.5px] text-[#161320]";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="max-w-[720px]">
      <div className="mb-[20px]">
        <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">MORE</div>
        <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[26px] text-[#161320] sm:text-[32px]">
          Settings
        </h1>
        <p className="font-['Inter'] text-[13.5px] text-[#8B8798]">Your account and how the team is managed.</p>
      </div>

      <div className="flex flex-col gap-[16px]">
        <section className={card}>
          <h2 className="mb-[14px] font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#161320]">Your account</h2>
          <dl className="grid grid-cols-1 gap-[14px] sm:grid-cols-3">
            <div>
              <dt className={label}>NAME</dt>
              <dd className={value}>{user?.name}</dd>
            </div>
            <div className="min-w-0">
              <dt className={label}>EMAIL</dt>
              <dd className={`${value} truncate`}>{user?.email}</dd>
            </div>
            <div>
              <dt className={label}>ROLE</dt>
              <dd className={`${value} capitalize`}>{user?.role}</dd>
            </div>
          </dl>
        </section>

        <section className={card}>
          <h2 className="mb-[8px] font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#161320]">Password</h2>
          <p className="mb-[14px] font-['Inter'] text-[13.5px] text-[#4B4757]">
            We'll email you a 6-digit code, then you can choose a new password.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block rounded-full border-[1.5px] border-[#6D4AFF] px-[18px] py-[9px] font-['Inter'] text-[13.5px] font-semibold text-[#6D4AFF] hover:bg-[#F7F4FF]"
          >
            Reset my password
          </Link>
        </section>

        <section className={card}>
          <h2 className="mb-[8px] font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#161320]">Adding team members</h2>
          <p className="mb-[10px] font-['Inter'] text-[13.5px] text-[#4B4757]">
            New admins sign up like any other user. Then, in the server folder, run:
          </p>
          <code className="block rounded-[10px] bg-[#FAFAFB] px-[14px] py-[10px] font-mono text-[13px] text-[#161320]">
            npm run make-admin -- their@email.com
          </code>
          <p className="mt-[10px] font-['Inter'] text-[12.5px] text-[#8B8798]">
            They need to log out and back in to see the dashboard.
          </p>
        </section>

        <section className={card}>
          <h2 className="mb-[8px] font-['Bricolage_Grotesque'] text-[17px] font-bold text-[#161320]">Legal</h2>
          <p className="font-['Inter'] text-[13.5px] text-[#4B4757]">
            <Link to="/terms" className="text-[#6D4AFF] underline">Terms of Service</Link>
            {" · "}
            <Link to="/privacy" className="text-[#6D4AFF] underline">Privacy Policy</Link>
          </p>
        </section>

        <button
          type="button"
          onClick={handleLogout}
          className="self-start rounded-full bg-[#161320] px-[20px] py-[10px] font-['Inter'] text-[13.5px] font-semibold text-white hover:bg-black"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Settings;
