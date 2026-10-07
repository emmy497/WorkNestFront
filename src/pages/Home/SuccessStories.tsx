import PhotoCard from "../../components/PhotoCard";

const SuccessStories = () => {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-[100px] mt-24 lg:mt-[170px] mb-24 lg:mb-[175px]">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="w-full flex-1 lg:my-auto">
          <div className="font-['Inter'] font-medium text-[12.64px] leading-[18.96px] tracking-[1.77px] align-middle uppercase text-[#6D4AFF] [leading-trim:none] mb-[16px]">
            The other side
          </div>

          <div className="font-['Bricolage_Grotesque'] font-bold text-3xl sm:text-4xl lg:text-[46px] leading-tight lg:leading-[50.87px] tracking-tight lg:tracking-[-1.36px] align-middle text-[#161320] [leading-trim:none] mb-[17px]">
            People who stopped searching and started Monday.
          </div>

          <div className="font-['Inter'] font-normal text-base lg:text-[18.96px] leading-relaxed lg:leading-[30.71px] tracking-normal align-middle text-[#4B4757] [leading-trim:none] mb-[16px]">
            Everyone here applied, got reviewed by a real person on our team,
            and landed somewhere new. The next face could be yours.
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:gap-[21.07px] pt-[13.38px]">
            <div className="font-['Bricolage_Grotesque'] font-extrabold text-3xl lg:text-[35.81px] leading-tight lg:leading-[53.72px] tracking-tight lg:tracking-[-0.72px] align-middle text-[#6D4AFF] [leading-trim:none]">
              2,400+
            </div>
            <div className="font-['Inter'] font-normal text-sm lg:text-[14.75px] leading-relaxed lg:leading-[20.64px] tracking-normal align-middle text-[#4B4757] [leading-trim:none] max-w-[240px]">
              people placed at companies hiring through WorkNest
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col lg:flex-row gap-4 lg:gap-[16.12px]">
          <div className="flex flex-col gap-4 lg:gap-[16.12px]">
            <PhotoCard
              src="/images/Adaeze.svg"
              name="Adaeze Nwankwo"
              role="Product Designer"
              company="Moniepoint"
            />
            <PhotoCard
              src="/images/tolu.svg"
              name="Tolu Ajayi"
              role="Data Analyst"
              company="Cowrywise"
            />
          </div>

          <div className="flex flex-col gap-4 lg:gap-[16.12px] lg:mt-12">
            <PhotoCard
              src="/images/Ibrahim.svg"
              name="Ibrahim Kalu"
              role="Backend Engineer"
              company="Flutterwave"
            />
            <PhotoCard
              src="/images/Ngozi.svg"
              name="Ngozi Eze"
              role="Frontend Engineer"
              company="Paystack"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
