import React from "react";
import TestimonialsCard from "../../components/TestimonialsCard";

const testimonials = [
  {
    quote:
      "Someone actually replied with feedback. After months of silence everywhere else, that alone kept me going.",
    name: "Amara Okafor",
    role: "Product Designer at Moniepoint",
    avatar: "/images/amaraOkaforTestimonial.svg",
  },
  {
    quote:
      "I applied on a Tuesday and had a call booked by Friday. No forms to re-fill, no chasing anyone for an update.",
    name: "Ibrahim Kalu",
    role: "Backend Engineer at Flutterwave",
    avatar: "/images/Ibrahim.svg",
  },
  {
    quote:
      "Knowing a real person read my application changed how I wrote it. I stopped writing for a robot and started writing for someone.",
    name: "Ngozi Eze",
    role: "Frontend Engineer at Paystack",
    avatar: "/images/Ngozi.svg",
  },
];

const Testimonies = () => {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
      <div className="opacity-100">
        <div className="font-['Inter'] font-medium text-[12px] leading-[18px] tracking-[1.68px] align-middle uppercase text-[hsla(252,100%,65%,1)] [leading-trim:none] mb-[12px]">
          In their words
        </div>

        <div className="font-['Bricolage_Grotesque'] font-bold text-3xl sm:text-4xl lg:text-[46px] leading-tight lg:leading-[46.2px] tracking-tight lg:tracking-[-1.14px] align-middle text-[#161320] [leading-trim:none] mb-[12px]">
          From the people we've placed.
        </div>

        <div className="font-['Inter'] font-normal text-base lg:text-[17px] leading-relaxed lg:leading-[25.5px] tracking-normal align-middle text-[#4B4757] [leading-trim:none] w-full max-w-[428.98px] mb-8 lg:mb-[38px]">
          Real candidates who stopped applying into the void and ended up
          somewhere new.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[47px]">
          {testimonials.map((item) => (
            <TestimonialsCard
              key={item.name}
              quote={item.quote}
              name={item.name}
              role={item.role}
              avatar={item.avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonies;
