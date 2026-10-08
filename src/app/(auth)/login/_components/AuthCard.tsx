import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard = ({ children } : AuthCardProps) => {
  return (
    <div className="flex flex-col border border-black/10 w-full p-8 rounded-4xl bg-auth-card gap-y-8">
      {children}
    </div>
  )
}