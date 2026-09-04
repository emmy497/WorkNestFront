import Navbar from "../../components/Navbar";
import SearchBar from "../../components/SearchBar";

const Header = () => {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[#F5F4FF] px-4  sm:px-8 md:px-16 lg:px-[100px] x`">
        <img
          className="absolute right-0 top-0 z-[3] hidden sm:block"
          src="/images/Blob-TopRight.png"
          alt=""
        />
        <img
          src="/images/Blob-BottomLeft.svg"
          className="absolute left-0 bottom-0"
          alt=""
        />
        <Navbar />

        <section className="relative mt-10 lg:mt-[75px]">
          {/* Left group of floating photos — desktop only.
              Each one fades in slightly after the one before it. The delay is
              an inline style because it's a different number every time, and
              Tailwind can only generate classes it can see written out. */}
          <div className="absolute left-0 top-[148px] h-[148px] w-[118px]">
            <img
              src="/images/Photo-Card-1.png"
              alt=""
              style={{ animationDelay: "150ms" }}
              className="animate-fade-in-up absolute top-[-80%] hidden h-[148px] w-[118px] object-cover lg:block"
            />
            <img
              src="/images/Photo-Card-2.png"
              alt=""
              style={{ animationDelay: "300ms" }}
              className="animate-fade-in-up absolute right-[-100%] hidden h-[148px] w-[118px] object-cover lg:block"
            />
            <img
              src="/images/Photo-Card-3.png"
              alt=""
              style={{ animationDelay: "450ms" }}
              className="animate-fade-in-up absolute bottom-[-80%] left-0 hidden h-[148px] w-[118px] object-cover lg:block"
            />
          </div>

          {/* Right group of floating photos — desktop only */}
          <div className="absolute right-0 top-[148px] h-[148px] w-[118px]">
            <img
              src="/images/Photo-Card-4.png"
              alt=""
              style={{ animationDelay: "225ms" }}
              className="animate-fade-in-up absolute top-[-70%] hidden h-[148px] w-[118px] object-cover lg:block"
            />
            <img
              src="/images/Photo-Card-5.png"
              alt=""
              style={{ animationDelay: "375ms" }}
              className="animate-fade-in-up absolute left-[-100%] hidden h-[148px] w-[118px] object-cover lg:block"
            />
            <img
              src="/images/Photo-Card-6.png"
              alt=""
              style={{ animationDelay: "525ms" }}
              className="animate-fade-in-up absolute bottom-[-80%] right-0 hidden h-[148px] w-[118px] rounded-2xl object-cover lg:block"
            />
          </div>

          {/* Centered hero content */}
          <div className="relative z-10 mx-auto mt-6 w-full max-w-[680px] text-center lg:mt-[24px]  lg:pb-[41px]">
            <span className="inline-block h-[31px] rounded-full bg-white px-4 py-2 text-[10px] font-semibold text-violet-600 shadow-sm sm:text-xs">
              A HIRING HUB, NOT A JOB BOARD
            </span>

            <h1 className="mt-4 text-center font-[Bricolage_Grotesque] text-4xl font-bold leading-tight tracking-tight text-[#1A1333] sm:text-5xl lg:mt-[21px] lg:text-[68px] lg:leading-[68px] lg:tracking-[-2.58px]">
              Where <br />
              applications <br />
              <span className="bg-gradient-to-r from-[#6D4AFF] to-[#A07CFF] bg-clip-text text-transparent">
                don't disappear.
              </span>
            </h1>

            <div className="mx-auto mt-4 max-w-[90%] font-[Inter] text-sm font-medium leading-relaxed text-[#6B6489] opacity-50 sm:max-w-[560px] sm:text-base lg:mt-[24px] lg:text-[18px] lg:leading-[29px]">
              Companies bring us the roles they're hiring for. We review every
              candidate, shortlist the strongest, and put you in front of the
              people who actually decide.
            </div>

            <div className="mx-auto mt-6">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center items-center text-center font-[Inter] relative lg:mt-[24px] lg:flex-nowrap">
              <img className="w-[56px]" src="/images/Frame.svg" alt="" />
              <div className="text-[#9791B0] text-[13px] leading-[18px]">
                2,400+ candidates placed · Reviewed by real people, never a bot
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Header;
