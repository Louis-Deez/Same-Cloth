"use client"

import {SelectionData} from "@/models/form/selectionData";
import {useState} from "react";
import Select, {MultiValue} from "react-select";
import {InvalidMessage} from "@/components/InvalidMessage";
import {formSelectionStyle} from "@/components/form/formSelectionConfig";

interface FormSelectionProps {
  id: string;
  label: string;
  options: SelectionData[];
  placeholder: string;
  className?: string;
  required?: boolean;
  errorMessage?: string;
  validated?: boolean;
}

/**
 * @param id - The unique identifier for the input
 * @param label - The label for the input
 * @param options - The options for the select
 * @param onChange - The function to call when the input value changes
 * @param placeholder - The placeholder text for the input, you should write it in colloquial English
 * @param className - Additional CSS classes to apply to the input, you will most likely not need this
 * @param required - Whether the input is required
 * @param errorMessage - The error message to display if the input is invalidated
 * @param validated - Whether the input has been validated (e.g., by a server)
 *
 * Both SingleSelect and MultiSelect are very similar to FormInput. The only difference is that MultiSelect is for
 * multiple selections, while SingleSelect is for single selections.
 */

// Value takes an array of strings, representing the selected values.
interface MultiSelectProps extends FormSelectionProps {
  onChange : (value: string[]) => void;
  value: string[];
}

export const MultiSelect = ({id, label, options, onChange, placeholder, className, required, errorMessage, validated, value }: MultiSelectProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const invalid = required && isTouched && value.length === 0 && !validated;

  return (
    <div className={`flex flex-col gap-y-1 ${className ?? ""}`}>
      <div className="flex items-center gap-x-2">
        <label htmlFor={id}>{label}</label>
        {!required && (
          <span className="text-md! text-neutral-400">(optional)</span>
        )}
      </div>
      <Select<SelectionData, true>
        isMulti
        unstyled
        instanceId={id}
        options={options}
        value={options.filter((o) => value.includes(o.value))}
        onChange={(selected: MultiValue<SelectionData>) =>
          onChange(selected.map((o) => o.value))
        }
        onBlur={() => setTouched(true)}
        required={required ?? false}
        aria-invalid={invalid}
        placeholder={placeholder}
        aria-errormessage={errorMessage ? `${id}-error` : undefined}
        classNames={formSelectionStyle()}
      />
      {invalid && InvalidMessage({id, errorMessage})}
    </div>
  )
}

// Value takes a string, representing a selected value.
interface SingleSelectProps extends FormSelectionProps {
  onChange : (value: string) => void;
  value: string;
}

export const SingleSelect = ({id, label, options, onChange, placeholder, className, required, errorMessage, validated, value }: SingleSelectProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const invalid = required && isTouched && value.length === 0 && !validated;

  return (
    <div className={`flex flex-col gap-y-1 ${className ?? ""}`}>
      <div className="flex items-center gap-x-2">
        <label htmlFor={id}>{label}</label>
        {!required && (
          <span className="text-md! text-neutral-400">(optional)</span>
        )}
      </div>
      <Select<SelectionData>
        unstyled
        instanceId={id}
        inputId={id}
        options={options}
        value={options.find((o) => o.value === value)}
        onChange={(selected) => onChange(selected?.value ?? "")}
        onBlur={() => setTouched(true)}
        required={required ?? false}
        aria-invalid={invalid}
        placeholder={placeholder}
        aria-errormessage={errorMessage ? `${id}-error` : undefined}
        classNames={formSelectionStyle()}
      />
      {invalid && InvalidMessage({id, errorMessage})}
    </div>
  )
}