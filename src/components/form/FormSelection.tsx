"use client"

import {SelectionData} from "@/models/form/selectionData";
import {useState} from "react";

interface FormSelectionProps {
  id: string;
  label: string;
  options: SelectionData[];
  onChange : (value: string[]) => void;
  placeholder: string;
  className?: string;
  required?: boolean;
  errorMessage?: string;
  validated?: boolean;
}

interface MultiSelectProps extends FormSelectionProps {
  value: string[];
}

export const MultiSelect = ({id, label, options, onChange, placeholder, className, required, errorMessage, validated, value }: MultiSelectProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const invalid = required && isTouched && !value;

  return (
    <div>

    </div>
  )
}

interface SingleSelectProps extends FormSelectionProps {
  value: string;
}

export const SingleSelect = ({id, label, options, onChange, placeholder, className, required, errorMessage, validated, value }: SingleSelectProps) => {
  const [isTouched, setTouched] = useState<boolean>(false);
  const invalid = required && isTouched && !value;

  return (
    <div>

    </div>
  )
}