import React from "react";

interface ButtonProps {
  label?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void; // TODO: implement this
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

/**
 * @param label - The text to display on the button
 * @param className - Additional CSS classes to apply to the button
 * @param disabled - Whether the button is disabled
 * @param onClick - The function to call when the button is clicked
 * @param type - The type of button (e.g., "button", "submit", "reset")
 * @param icon - The icon to display on the button
 *
 * @Note - The button can either have a label or an icon, but not both. If both are provided, the button breaks (visually).
 */

export const Button = ({ label, className, disabled, onClick, type, icon }: ButtonProps) => {
  return (
    <button
      className={`bg-button-primary w-full rounded-xl py-3 font-semibold text-white transition-all hover:brightness-90 ${className ?? ""}`}
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
      {icon}
    </button>
  );
};
