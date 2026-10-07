import { Link } from "react-router-dom";


const Cta = () => {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
      <div className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[35px] bg-[#140A28] px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24 lg:px-[140px] lg:py-[130px]">
        <img
          src="/images/cta-top-blur.png"
          className="pointer-events-none absolute top-0 ml-[4%] max-w-[70%] lg:max-w-none"
          alt=""
        />
        <img
          src="/images/cta-yelllow-blur.svg"
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 max-w-[60%] lg:max-w-none"
        />
        <img
          className="pointer-events-none absolute t `op-0 left-0 h-[80px] w-[80px] rounded-tl-[24px] sm:h-[110px] sm:w-[110px] lg:h-[160px] lg:w-[160px] lg:rounded-tl-[35px]"
          src="/images/cta-black.svg"
          alt=""
        />

        <div className="relative mx-auto max-w-[990px]">
          <div className="font-['Bricolage_Grotesque'] font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[58px] leading-tight lg:leading-[59.16px] tracking-tight lg:tracking-[-2.2px] text-center text-white mb-4 lg:mb-[24px] max-w-[620px] mx-auto">
            Your next role is on the{" "}
            <span className="text-[#FFC93C]">other side</span> of one profile.
          </div>

          <div className="font-['Inter'] font-normal text-base lg:text-[18px] leading-relaxed lg:leading-[27px] text-center text-[hsla(0,0%,100%,0.68)] max-w-[488px] mx-auto pb-[14px]">
            Set it up once and start applying to roles at companies genuinely
            hiring — with people who'll actually get back to you.
          </div>

          <Link
            to="/profile/edit"
            className="mt-6 lg:mt-[24px] block mx-auto w-full max-w-[213px] text-center rounded-[999px] bg-[hsla(43,100%,62%,1)] px-6 py-[14px] lg:px-[34px] lg:py-[16px] font-['Inter'] font-medium text-[15px] lg:text-base text-[#463400] shadow-[0px_10px_30px_0px_hsla(43,100%,62%,0.4)]"
          >
            Create your profile
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;
