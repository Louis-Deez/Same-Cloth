import React from "react";

interface IconBlockProps {
  icon: React.ReactNode;
}

// This component is used to display an icon with a rounded border and a drop shadow. No other functionality is provided.
export const IconBlock = ({ icon }: IconBlockProps) => {
  return (
    <div
      className="text-accent border-line bg-surface aspect-square w-fit rounded-3xl border p-5"
      style={{ filter: "drop-shadow(0 4px 6px var(--icon-shadow))" }}
    >
      {icon}
    </div>
  );
};
