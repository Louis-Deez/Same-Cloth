"use client";

import React, { useState } from "react";

interface FormTextAreaProps {
  className?: string;
  label: string;
  placeholder: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  errorMessage?: string;
}

/**
 * @param className - Additional CSS classes to apply to the input, you will most likely not need this
 * @param label - The label for the input
 * @param id - The unique identifier for the input
 * @param value - The current value of the input
 * @param onChange - The function to call when the input value changes
 * @param required - Whether the input is required
 * @param errorMessage - The error message to display if the input is invalidated
 * @param placeholder - The placeholder text for the input, you should write it in colloquial English
 *
 * FormTextArea is very similar to FormInput. The only difference is that FormTextArea is for multiline inputs. This is
 * perfect for descriptions, comments, bios, etc.
 */

export const FormTextArea = ({
  className,
  label,
  id,
  value,
  onChange,
  required,
  errorMessage,
  placeholder,
}: FormTextAreaProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const invalid = required && isTouched && !value;

  return (
    <div className={`flex flex-col gap-y-1 ${className ?? ""}`}>
      <div className="flex items-center gap-x-1">
        <label htmlFor={id}>{label}</label>
        {!required && <span className="text-md! text-neutral-400">(optional)</span>}
      </div>
      <textarea
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        aria-invalid={invalid}
        className={`text-sm ${invalid ? "!border-red-500 !bg-red-50" : ""}`}
        required={required ?? false}
      />
    </div>
  );
};
