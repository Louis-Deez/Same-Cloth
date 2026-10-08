"use client"

import Image from "next/image";
import {AuthCard} from "@/app/(auth)/_components/AuthCard";
import {IconBlock} from "@/app/(auth)/_components/IconBlock";
import {PersonIcon} from "@radix-ui/react-icons";
import {useState} from "react";

const SignupView = () => {
  const [step, setStep] = useState<number>(0);
  return (
    <div className="flex h-screen w-screen">
      <Image
        src="/images/placeholder_login.jpeg"
        width={1000}
        height={1000}
        alt="login"
        className="w-7/9 object-cover"
      />
      <div className="bg-light-background flex w-1/2 flex-col items-center justify-center p-8">
        <div className="flex h-full w-full flex-col gap-y-8 border border-black/10 p-8 overflow-y-auto">
          <AuthCard primary={true}>
            <IconBlock icon={<PersonIcon height={40} width={40} />} />
            <div className="flex flex-col gap-y-2">
              <h3>Who are you?</h3>
              <p>Create a new account with Same Cloth</p>
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}

export default SignupView;