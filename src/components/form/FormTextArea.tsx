"use client"

import React, {useState} from "react";

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

export const FormTextArea = ({ className, label, id, value, onChange, required, errorMessage, placeholder }: FormTextAreaProps) => {
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
  )
}