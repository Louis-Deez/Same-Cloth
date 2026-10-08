"use client"

import Image from "next/image";
import {AuthCard} from "@/app/(auth)/_components/AuthCard";
import {useState} from "react";
import {emptyLoginPayload, LoginPayload} from "@/models/login/payload";
import UserIdentification from "@/app/(auth)/signup/_form/UserIdentification";
import {Button} from "@/components/Button";

const SignupView = () => {
  const [step, setStep] = useState<number>(0);
  const [payload, setPayload] = useState<LoginPayload>(emptyLoginPayload);
  const [valid, setValid] = useState<boolean>(false);

  const forms = [
    { label: "Who are you?", component: UserIdentification }
  ];
  const Current = forms[step].component;

  const onForward = () => {
    setStep(step + 1);
  }

  const onBack = () => {
    setStep(step - 1);
  }

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
            <Current
              data={payload}
              onChange={(updates) => setPayload((prev) => ({...prev, ...updates}))}
              onValidChange={setValid}
            />
            <div className="flex items-center justify-between gap-x-2">
              <Button
                className={step !== 0 ? `w-full` : `hidden`}
                onClick={onBack}
                primary={true}
                label="Go Back"
              />
              <Button
                onClick={onForward}
                label="Continue"
                primary={true}
              />
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}

export default SignupView;