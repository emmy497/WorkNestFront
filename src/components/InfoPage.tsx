import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  updated?: string;
  children: ReactNode;
};

export const InfoSection = ({ id, title, children }: { id?: string; title: string; children: ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="mb-3 font-['Bricolage_Grotesque'] text-[22px] font-bold leading-[30px] tracking-[-0.4px] text-[#161320] sm:text-[24px]">
      {title}
    </h2>
    <div className="flex flex-col gap-3 font-['Inter'] text-[15px] leading-[25px] text-[#4B4757] [&_a]:text-[#6D4AFF] [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-[#161320]">
      {children}
    </div>
  </section>
);

const InfoPage = ({ eyebrow, title, intro, updated, children }: InfoPageProps) => (
  <>
    <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
      <Navbar />

      <div className="mx-auto max-w-[760px] pt-[43px]">
        <div className="mb-[12px] font-['Inter'] text-[11.5px] font-medium uppercase leading-[17.25px] tracking-[1.61px] text-[#6D4AFF]">
          {eyebrow}
        </div>
        <h1 className="mb-[12px] font-['Bricolage_Grotesque'] text-4xl font-extrabold leading-tight tracking-tight text-[#161320] lg:text-[50px] lg:leading-[54px] lg:tracking-[-1.75px]">
          {title}
        </h1>
        {updated && (
          <p className="mb-4 font-['Inter'] text-[13px] text-[#8B8798]">Last updated: {updated}</p>
        )}
        {intro && (
          <div className="font-['Inter'] text-[17px] leading-[28px] text-[#4B4757]">{intro}</div>
        )}

        <div className="mt-10 flex flex-col gap-10">{children}</div>
      </div>
    </div>

    <Footer />
  </>
);

export default InfoPage;
