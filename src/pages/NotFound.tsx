import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => (
  <>
    <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
      <Navbar />
      <div className="py-24 text-center">
        <div className="mb-3 font-['Inter'] text-[11.5px] font-medium uppercase tracking-[1.61px] text-[#6D4AFF]">404</div>
        <h1 className="mb-3 font-['Bricolage_Grotesque'] text-4xl font-extrabold tracking-tight text-[#161320]">
          We couldn't find that page
        </h1>
        <p className="mb-6 font-['Inter'] text-[15px] text-[#4B4757]">The link may be wrong, or the page may have moved.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-[#6D4AFF] px-6 py-3 font-['Inter'] text-[14px] font-semibold text-white hover:bg-[#5D3CE0]">
            Go home
          </Link>
          <Link to="/find-jobs" className="rounded-full border-[1.5px] border-[#6D4AFF] px-6 py-3 font-['Inter'] text-[14px] font-semibold text-[#6D4AFF]">
            Browse jobs
          </Link>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default NotFound;
