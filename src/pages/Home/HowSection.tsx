const HowSection = () => {
  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px] pt-[32px]">
        <div className="hidden lg:block text-[12px] leading-[18px] tracking-[1.38px] uppercase text-center mb-[26px]">
          Roles open right now{" "}
          <span className="text-[#6D4AFF]">through WorkNest</span>
        </div>

        <div className="relative flex flex-wrap justify-center gap-6 sm:gap-8 text-[#C4C2CE] font-[Inter] text-sm sm:text-base px-4 pb-10  lg:flex-nowrap lg:justify-center mb-[115px] lg:gap-[48px] lg:text-[20px] lg:px-0 lg:pb-[59px]">
          <div>Moniepoint</div>
          <div>Paystack</div>
          <div>Kuda</div>
          <div>Flutterwave</div>
          <div>Cowrywise</div>
          <div>Bumpa</div>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between mb-10 lg:mb-[63px] gap-6 lg:gap-[165px]">
          <div className="font-['Bricolage_Grotesque'] font-bold text-3xl sm:text-4xl lg:text-[46px] leading-tight lg:leading-[47.84px] tracking-tight lg:tracking-[-1.29px] align-middle [leading-trim:none]">
            Three steps. One of them is the reason people stay
          </div>
          <div className="font-['Inter'] font-normal text-base lg:text-[18px] leading-relaxed lg:leading-[28.8px] tracking-normal align-middle [leading-trim:none] text-[#4B4757]">
            Most job sites end when you hit submit. Ours is just getting started
            because a person on our team picks up your application from there.h
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[41px]">
          <div className="flex-1">
            <div className="w-full h-auto lg:h-[283px] rounded-[24px] lg:rounded-[30.94px] border-[1.11px] border-[#ECEBF0] bg-white p-6 lg:p-[35.37px] gap-[10.06px] shadow-[0px_1.11px_3.32px_0px_#1613200F,0px_1.11px_2.21px_0px_#1613200D] mb-6 lg:mb-[46px]">
              <img src="/images/Background.svg" alt="" />
              <div className="font-['Inter'] font-normal text-[11px] lg:text-[12.71px] leading-relaxed lg:leading-[19.06px] tracking-[1.27px] align-middle text-[#8B8798] mt-4 lg:mt-[23px] [leading-trim:none]">
                STEP 01
              </div>

              <div className="font-['Bricolage_Grotesque'] font-bold text-xl lg:text-[24.31px] leading-snug lg:leading-[36.47px] tracking-tight lg:tracking-[-0.49px] align-middle [leading-trim:none] mt-[10px]">
                Build your profile once
              </div>

              <div className="font-['Inter'] font-normal text-sm lg:text-[16.58px] leading-relaxed lg:leading-[26.86px] tracking-normal align-middle [leading-trim:none] text-[#4B4757] mt-[10px]">
                Your details, CV, and work — filled in a single time and reused
                on every application, so you're never re-typing the same forty
                fields.
              </div>
            </div>

            {/* Apply */}
            <div className="w-full h-auto lg:h-[283px] rounded-[24px] lg:rounded-[30.94px] border-[1.11px] border-[#ECEBF0] bg-white p-6 lg:p-[35.37px] gap-[10.06px] shadow-[0px_1.11px_3.32px_0px_#1613200F,0px_1.11px_2.21px_0px_#1613200D]">
              <img src="/images/Bolt.svg" alt="" />
              <div className="font-['Inter'] font-normal text-[11px] lg:text-[12.71px] leading-relaxed lg:leading-[19.06px] tracking-[1.27px] align-middle text-[#8B8798] mt-4 lg:mt-[23px] [leading-trim:none]">
                STEP 02
              </div>

              <div className="font-['Bricolage_Grotesque'] font-bold text-xl lg:text-[24.31px] leading-snug lg:leading-[36.47px] tracking-tight lg:tracking-[-0.49px] align-middle [leading-trim:none] mt-[10px]">
                Apply in one tap
              </div>

              <div className="font-['Inter'] font-normal text-sm lg:text-[16.58px] leading-relaxed lg:leading-[26.86px] tracking-normal align-middle [leading-trim:none] text-[#4B4757] mt-[10px]">
                Answer a couple of role-specific questions and send. Everything
                the company needs is already attached from your profile.
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <img
              className="w-full h-[320px] sm:h-[420px] lg:h-[603px] rounded-[24px] lg:rounded-[30.94px] shadow-[0px_33.16px_88.41px_0px_#6D4AFF52] object-cover"
              src="/images/reviewImage.svg"
              alt=""
            />
            <div className="absolute top-5 left-5 lg:top-[35px] lg:left-[35px]">
              <img src="/images/Overlay.svg" alt="" />
              <div className="font-['Inter'] font-normal text-[11px] lg:text-[12.71px] leading-relaxed lg:leading-[19.06px] tracking-[1.27px] align-middle [leading-trim:none] text-[#FFC93C] mt-4 lg:mt-[23px]">
                STEP 03
              </div>
            </div>
            <div className="px-5 lg:px-[35px] h-auto absolute bottom-5 lg:bottom-[35px]">
              <div className="font-['Bricolage_Grotesque'] font-bold text-2xl lg:text-[34.26px] leading-tight lg:leading-[51.39px] tracking-tight lg:tracking-[-0.69px] align-middle [leading-trim:none] text-white">
                A real person reviews you
              </div>
              <div className="font-['Inter'] font-normal text-sm lg:text-[17.68px] leading-relaxed lg:leading-[28.65px] tracking-normal align-middle [leading-trim:none] text-[rgba(255,255,255,0.85)]">
                No keyword filter, no black hole. Someone on our team reads your
                application, scores it against the role, and shortlists the
                strongest — then tells you where you stand.
              </div>
              <div className="w-fit h-auto rounded-full py-[6.63px] px-4 lg:px-[13.26px] bg-[#FFC93C] flex items-center justify-center font-['Inter'] font-normal text-[11px] lg:text-[12.16px] leading-relaxed lg:leading-[18.24px] mt-3 lg:mt-[22px] uppercase [leading-trim:none]">
                This is the difference
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Four steps. One of them is the reason people stay  */}
      <section className="mt-16 lg:mt-[155px] px-4 sm:px-8 md:px-16 lg:px-[100px] mb-16 lg:mb-[140px]">
        <div className="flex flex-col w-full max-w-[570px] h-auto gap-4 lg:gap-[34px] mx-auto mb-10 lg:mb-[68px]">
          <div className="font-['Bricolage_Grotesque'] font-bold text-3xl sm:text-4xl lg:text-[46px] leading-tight lg:leading-[47.84px] tracking-tight lg:tracking-[-1.29px] text-center align-middle [leading-trim:none]">
            The opposite of shouting into a void.
          </div>

          <div className="font-['Inter'] font-normal text-base lg:text-[18px] leading-relaxed lg:leading-[28.8px] tracking-normal text-center align-middle [leading-trim:none] text-[#4B4757]">
            A job board hosts a form and hopes for the best. WorkNest sits
            between you and the company and does the work that usually goes
            missing.
          </div>
        </div>

        {/* flex container start */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[34px]">
          <div className="w-full flex-1 min-w-0 bg-[#140A28] rounded-[24px] lg:rounded-[31.22px] pt-6 pb-6 px-6 lg:pt-[32.34px] lg:pb-[33.45px] lg:px-[33.45px]">
            <div className="font-['Inter'] font-normal text-[11px] lg:text-[12.82px] leading-relaxed lg:leading-[19.24px] tracking-[0.77px] align-middle [leading-trim:none] text-[#FFC93C] mb-6 lg:mb-[34px]">
              // read by a human
            </div>

            {/* Every Application */}
            <div className="font-['Bricolage_Grotesque'] font-bold text-2xl sm:text-3xl lg:text-[33.45px] leading-tight lg:leading-[50.18px] tracking-tight lg:tracking-[-0.67px] align-middle [leading-trim:none] text-white">
              Every application is actually reviewed.
            </div>

            <div className="font-['Inter'] font-normal text-sm lg:text-[16.73px] leading-relaxed lg:leading-[26.43px] tracking-normal align-middle [leading-trim:none] text-[rgba(255,255,255,0.66)] mt-6 lg:mt-[33px]">
              Not parsed by an ATS hunting keywords — read, scored, and
              shortlisted by someone whose whole job is finding the right people
              for the role.
            </div>
          </div>

          {/* Right part of div */}

          <div className="w-full flex-1">
            {/* You always know where you stand */}
            <div className="h-auto rounded-[24px] lg:rounded-[31.22px] border-[1.12px] border-[#ECEBF0] py-4 lg:py-[16.73px] px-6 lg:px-[33.45px] gap-[7.81px]">
              <div className="font-['Inter'] font-normal text-[11px] lg:text-[12.82px] leading-relaxed lg:leading-[19.24px] tracking-[0.77px] align-middle [leading-trim:none]">
                // no ghosting
              </div>
              <div className="font-['Bricolage_Grotesque'] font-bold text-lg lg:text-[23.42px] leading-snug lg:leading-[35.13px] tracking-tight lg:tracking-[-0.47px] align-middle [leading-trim:none]">
                You always know where you stand
              </div>
              <div className="font-['Inter'] font-normal text-sm lg:text-[16.17px] leading-relaxed lg:leading-[25.55px] tracking-normal align-middle [leading-trim:none] text-[rgba(75,71,87,1)]">
                Your status moves in the open — submitted, reviewed,
                shortlisted, interviewing — and you hear from us either way.
              </div>

              <div className="w-full flex gap-[6.69px] pt-[12.27px]  ">
                <div className="h-[5.58px] rounded-[3.35px] w-[100px] bg-[#6D4AFF] "></div>
                <div className=""></div>
                <div className="h-[5.58px] rounded-[3.35px] w-[100px] bg-[#6D4AFF] "></div>
                <div className=""></div>
                <div className="h-[5.58px] rounded-[3.35px] w-[100px] bg-[#E0952A] "></div>
                <div className=""></div>
                <div className="h-[5.58px] rounded-[3.35px] w-[100px] bg-[#F2F1F6] "></div>
                <div className=""></div>
                <div className="h-[5.58px] rounded-[3.35px] w-[100px] bg-[#F2F1F6] "></div>
                <div className=""></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-[22px] mt-4 lg:mt-[22px]">
              <div className="h-auto w-full flex-1 rounded-[24px] lg:rounded-[31.22px] p-6 lg:p-[33.45px] bg-[#FFC93C]">
                <div className="font-['Bricolage_Grotesque'] font-extrabold text-4xl lg:text-[49.07px] leading-tight lg:leading-[49.07px] tracking-tight lg:tracking-[-1.47px] align-middle [leading-trim:none] text-[#463400] mb-6 lg:mb-[44px]">
                  72%
                </div>
                <div className="font-['Inter'] font-medium text-sm lg:text-[14.5px] leading-relaxed lg:leading-[22.91px] tracking-normal align-middle [leading-trim:none] text-[#463400]">
                  of shortlisted candidates reach an interview
                </div>
              </div>
              <div className="h-auto w-full flex-1 rounded-[24px] lg:rounded-[31.22px] border-[1.12px] border-[#ECEBF0] pt-6 pr-6 pb-6 pl-6 lg:pt-[32.34px] lg:pr-[33.45px] lg:pb-[54.74px] lg:pl-[33.45px] gap-[5.8px]">
                <div className="font-['Inter'] font-normal text-[11px] lg:text-[12.82px] leading-relaxed lg:leading-[19.24px] tracking-[0.77px] align-middle text-[#6D4AFF] [leading-trim:none] mb-3 lg:mb-[13px]">
                  // live roles only
                </div>
                <div className="font-['Bricolage_Grotesque'] font-bold text-lg lg:text-[20.07px] leading-snug lg:leading-[30.11px] tracking-tight lg:tracking-[-0.4px] align-middle text-[#161320] [leading-trim:none] mb-[6px]">
                  Real, open roles
                </div>
                <div className="font-['Inter'] font-normal text-sm lg:text-[15.05px] leading-relaxed lg:leading-[23.79px] tracking-normal align-middle text-[#4B4757] [leading-trim:none]">
                  If it's listed, a team is waiting to fill it.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowSection;
