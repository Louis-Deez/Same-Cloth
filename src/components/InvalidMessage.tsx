import { CrossCircledIcon } from "@radix-ui/react-icons";
import React from "react";

interface InvalidMessageProps {
  id: string;
  errorMessage?: string;
}

export const InvalidMessage = ({ id, errorMessage }: InvalidMessageProps) => {
  return (
    <div className="flex items-center gap-x-1 text-accent">
      <CrossCircledIcon className="scale-85" />
      <span className="!text-xs !text-accent" id={`${id}-error`}>
        {errorMessage ? errorMessage : "This field is required"}
      </span>
    </div>
  );
};
