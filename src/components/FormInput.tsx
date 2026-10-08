"use client"

import React, {useState} from "react";
import {InvalidMessage} from "@/components/InvalidMessage";

interface FormInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  className?: string;
  errorMessage: string;
  validated: boolean;
  inputMode?: "search" | "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined;
}

export const FormInput = ({ label, id, value, onChange, required, type, autoComplete, className, errorMessage, validated, inputMode }: FormInputProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const invalid = required && isTouched && !value && !validated;

  return (
    <div className={`flex flex-col gap-y-2 ${className ?? ""}`}>
      <div className="flex items-center gap-x-2">
        <label htmlFor={id}>{label}</label>
        {!required && (
          <span className="text-md! text-neutral-400">(optional)</span>
        )}
      </div>
      <input
        type={type ?? "text"}
        id={id}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required ?? false}
        onBlur={() => setTouched(true)}
        aria-invalid={invalid}
        className={invalid ? "!border-red-500 !bg-red-50" : ""}
        inputMode={inputMode ? inputMode : "text"}
      />
      {invalid && InvalidMessage({ id, errorMessage })}
    </div>
  )
}