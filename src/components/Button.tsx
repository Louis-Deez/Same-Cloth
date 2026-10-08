import React from "react";

interface ButtonProps {
  label?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void; // TODO: implement this
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

export const Button = ({ label, className, disabled, onClick, type, icon } : ButtonProps) => {
  return (
    <button
      className={`bg-button-primary w-full py-3 rounded-xl text-white font-semibold hover:brightness-90 transition-all
                  ${className ?? ""}`}
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
      {icon}
    </button>
  )
}