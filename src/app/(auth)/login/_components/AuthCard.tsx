import React from "react";

interface AuthCardProps {
  primary: boolean;
  children: React.ReactNode;
}

export const AuthCard = ({ children, primary } : AuthCardProps) => {
  return (
    <div
      className={`flex flex-col border border-black/10 w-full p-8 rounded-4xl gap-y-8 
                ${primary ? "bg-auth-card" : "bg-white"}`}>
      {children}
    </div>
  )
}