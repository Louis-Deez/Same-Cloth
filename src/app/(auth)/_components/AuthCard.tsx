import React from "react";

interface AuthCardProps {
  primary: boolean;
  children: React.ReactNode;
}

export const AuthCard = ({ children, primary }: AuthCardProps) => {
  return (
    <div
      className={`flex w-full flex-col gap-y-8 rounded-4xl border border-black/10 p-4 md:p-6 lg:p-8 ${primary ? "bg-auth-card" : "bg-white"}`}
    >
      {children}
    </div>
  );
};
