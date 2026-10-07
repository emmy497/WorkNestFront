import { useState } from "react";

const faqs = [
  {
    question: "Is WorkNest free for job seekers?",
    answer:
      "Yes. Creating a profile, browsing roles, and applying is completely free — you'll never be asked to pay to be seen by a company hiring through us.",
  },
  {
    question: "How is this different from a normal job board?",
    answer:
      "Normal boards end the moment you hit submit. Here, a real person on our team reads your application, scores it against the role, and tells you where you stand either way.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "Your application goes into review within 48 hours. You'll see your status move in the open — submitted, reviewed, shortlisted, interviewing — and you'll hear from us at every step.",
  },
  {
    question: "Who actually reviews my application?",
    answer:
      "Someone on our talent team whose whole job is matching people to roles. No keyword filters, no automated rejections, no black hole.",
  },
  {
    question: "Which companies hire through WorkNest?",
    answer:
      "Teams across fintech, product, and engineering — including Paystack, Flutterwave, Moniepoint, and Cowrywise. Every role listed is live and actively being filled.",
  },
  {
    question: "How will I hear about updates?",
    answer:
      "By email, and in your dashboard. You choose how often — every update as it happens, or a single weekly digest.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section className="mt-24 lg:mt-[180px] mb-24 lg:mb-[180px] px-4 sm:px-8 md:px-16 lg:px-[100px]">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px]">
        <div className="w-full lg:max-w-[400px] lg:flex-1">
          <div className="font-['Inter'] font-medium text-[13.06px] leading-[19.59px] tracking-[1.83px] uppercase text-[#6D4AFF]">
            faq
          </div>
          <div className="font-['Bricolage_Grotesque'] font-bold text-3xl sm:text-4xl lg:text-[47.89px] leading-tight lg:leading-[50.28px] tracking-tight lg:tracking-[-1.34px] text-[#161320] mt-[14.6px] mb-[14.26px]">
            Good to know before you start.
          </div>
          <div className="font-['Inter'] font-normal text-base lg:text-[17.41px] leading-relaxed lg:leading-[27.86px] text-[#4B4757]">
            The things people ask us most. Anything else, our team is one
            message away.
          </div>

          <a
            href="mailto:still-curious@worknest.co"
            className="mt-6 lg:mt-[28px] inline-flex items-center gap-[6px] font-['Inter'] font-normal text-[13.5px] leading-[20px] text-[#6D4AFF] hover:underline"
          >
            <span aria-hidden="true">↳</span>
            still-curious@worknest.co
          </a>
        </div>

        <div className="w-full lg:flex-1">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-t border-[#ECEBF0] last:border-b">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 sm:gap-6 py-[18px] lg:py-[22px] text-left"
                >
                  <span className="font-['Bricolage_Grotesque'] font-bold text-[15px] sm:text-[16px] lg:text-[17.2px] leading-[24px] lg:leading-[26px] tracking-[-0.3px] text-[#161320]">
                    {faq.question}
                  </span>

                  <span className="flex h-[26px] w-[26px] lg:h-[28px] lg:w-[28px] shrink-0 items-center justify-center rounded-full border border-[#E4E0FF] bg-white text-[#6D4AFF]">
                    <svg
                      className="h-[12px] w-[12px]"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    >
                      <path d="M1 6h10" />
                      {!isOpen && <path d="M6 1v10" />}
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-[20px] lg:pb-[22px] pr-0 lg:pr-[52px] font-['Inter'] font-normal text-[14.5px] lg:text-[15px] leading-[25px] lg:leading-[26px] text-[#4B4757]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
