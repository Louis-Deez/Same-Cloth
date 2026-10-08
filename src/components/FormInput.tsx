"use client";

import React, { useState } from "react";
import { InvalidMessage } from "@/components/InvalidMessage";

/**
 * I realized that I probably overengineered this component.
 *
 * This component handles errors, validation, and input modes. What's good with this is this essentially tackles most
 * types of validations and also adds security features.
 *
 */

interface FormInputProps {
  label: string;
  placeholder: string;
  id: string;
  value: string; // TODO: implement this
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // TODO: implement this
  required?: boolean;
  type?: string;
  autoComplete?: string;
  className?: string;
  errorMessage: string;
  validated?: boolean; // TODO: implement this
  inputMode?: "search" | "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined;
}

/**
 * @param label - The label for the input
 * @param id - The unique identifier for the input
 * @param value - The current value of the input
 * @param onChange - The function to call when the input value changes
 * @param required - Whether the input is required
 * @param type - The type of input (e.g., "text", "email", "password")
 * @param autoComplete - Whether the input should be autocompleted; this is entirely depended on the browser and OS
 * @param className - Additional CSS classes to apply to the input, you will most likely not need this
 * @param errorMessage - The error message to display if the input is invalidated
 * @param validated - Whether the input has been validated (e.g., by a server)
 * @param inputMode - The input mode (e.g., "search", "none", "text", "tel", "url", "email", "numeric", "decimal")
 * @param placeholder - The placeholder text for the input, you should write it in colloquial English
 *
 * For required inputs, isTouched and setTouched are used to determine if the user has interacted with the input
 * invalidly. For example, if the user has not entered a value and clicks out, the input is considered invalid.
 *
 * The other stuff like 'required' is for better clarity. Most inputs are required, but those that are optional should
 * be labeled explicitly.
 */

export const FormInput = ({
  label,
  id,
  value,
  onChange,
  required,
  type,
  autoComplete,
  className,
  errorMessage,
  validated,
  inputMode,
  placeholder,
}: FormInputProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const invalid = required && isTouched && !value && !validated;

  return (
    <div className={`flex flex-col gap-y-2 ${className ?? ""}`}>
      <div className="flex items-center gap-x-2">
        <label htmlFor={id}>{label}</label>
        {!required && <span className="text-md! text-neutral-400">(optional)</span>}
      </div>
      <input
        type={type ?? "text"}
        placeholder={placeholder}
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
  );
};
