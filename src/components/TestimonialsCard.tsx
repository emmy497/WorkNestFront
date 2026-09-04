type TestimonialsCardProps = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const TestimonialsCard = ({
  quote,
  name,
  role,
  avatar,
}: TestimonialsCardProps) => {
  return (
    <div className="flex h-full flex-col rounded-[24px] lg:rounded-[29.7px] border-[1.06px] border-[#ECEBF0] bg-white p-6 lg:p-[31.82px] shadow-[0px_1.06px_3.18px_0px_rgba(22,19,32,0.06),0px_1.06px_2.12px_0px_rgba(22,19,32,0.05)]">
      <img src="/images/Star.svg" alt="5 star rating" />

      <p className="font-['Inter'] font-normal text-[15px] lg:text-[16.97px] leading-relaxed lg:leading-[27.83px] text-[#161320] mt-[20px] mb-[26px]">
        {quote}
      </p>

      <div className="mt-auto flex items-center gap-[12.73px] pt-[21.21px] border-t-[1.06px] border-t-[#F2F1F6]">
        <img
          className="h-[47px] w-[47px] shrink-0 rounded-full object-cover"
          src={avatar}
          alt={name}
        />
        <div>
          <p className="font-['Inter'] font-semibold text-[15.38px] leading-[23.07px] text-[#161320]">
            {name}
          </p>
          <span className="font-['Inter'] font-normal text-[12.2px] leading-[18.3px] text-[#8B8798]">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCard;
