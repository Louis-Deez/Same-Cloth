import React from "react";

interface IconBlockProps {
  icon: React.ReactNode;
}

export const IconBlock = ({ icon }: IconBlockProps) => {
  return (
    <div
      className="bg-white rounded-4xl p-5 border border-black/10 w-fit aspect-square
                text-accent drop-shadow-accent/20 drop-shadow-md">
      {icon}
    </div>
  )
}