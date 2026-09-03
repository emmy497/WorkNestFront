import React from "react";

type PhotoCardProps = {
  src: string;
  name: string;
  role: string;
  company: string;
  className?: string;
};

const PhotoCard = ({ src, name, role, company, className }: PhotoCardProps) => {
  return (
    <div
      className={`relative w-full aspect-[279.88/349.85] overflow-hidden rounded-[29.49px] bg-[linear-gradient(163.77deg,_#6D4AFF_0%,_#2C1A5C_100%)] shadow-[0px_2.11px_5.27px_0px_#1613200D,0px_6.32px_18.96px_0px_#16132012] lg:aspect-auto lg:h-[349.85px] lg:w-[279.88px] ${className ?? ""}`}
    >
      <img
        src={src}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute bottom-[16.12px] left-[14.75px] right-[14.75px] flex min-h-[67.44px] flex-col items-start justify-center gap-[3.16px] rounded-[14.75px] border-[1.05px] border-[#FFFFFF29] bg-[#140A286B] px-[14.75px] py-[11.59px] backdrop-blur-[10.53px]">
        <div className="font-['Inter'] font-semibold text-[14.22px] leading-[21.33px] text-[#FFFFFF] [leading-trim:none]">
          {name}
        </div>
        <div className="font-['Inter'] font-normal text-[11.06px] leading-[16.59px] text-[hsla(0,0%,100%,0.72)] [leading-trim:none]">
          {role} · {company}
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
