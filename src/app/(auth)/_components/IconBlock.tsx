import React from "react";

interface IconBlockProps {
  icon: React.ReactNode;
}

export const IconBlock = ({ icon }: IconBlockProps) => {
  return (
    <div className="text-accent drop-shadow-accent/20 aspect-square w-fit rounded-3xl border border-black/10 bg-white p-5 drop-shadow-md">
      {icon}
    </div>
  );
};
