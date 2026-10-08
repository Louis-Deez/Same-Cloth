import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard = ({ children } : AuthCardProps) => {
  return (
    <div className="border border-black/10 w-full p-8 rounded-4xl bg-auth-card">
      {children}
    </div>
  )
}