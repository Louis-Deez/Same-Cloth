"use client"

import Image from "next/image";
import {AuthCard} from "@/app/(auth)/_components/AuthCard";
import {useState} from "react";
import {emptyLoginPayload, LoginPayload} from "@/models/login/payload";
import UserIdentification from "@/app/(auth)/signup/_form/UserIdentification";
import {Button} from "@/components/Button";
import UserPersonalization from "@/app/(auth)/signup/_form/UserPersonalization";

/**
 * Signup is a multistep process, hence why it is a separate page. Each step is stored inside an array with a label and
 * the corresponding component. The step index determines the current step.
 *
 * @hook step and setStep - This is used to keep track of the current step of the signup process.
 * @hook payload and setPayload - This is used to keep track of the data entered by the user.
 * @hook valid and setValid - This is used to keep track of whether the data entered by the user is valid.
 *
 * @IMPORTANT - Each step is a separate component but is a part of a larger form. This means that each step has to have
 * the same structure, otherwise everything will break. No more, no less.
 *
 * @STRUCTURE - Each step must have these props:
 *  data - The data entered by the user
 *  onChange - A function to update the data entered by the user
 *  onValidChange - A function to update whether the data entered by the user is valid
 */

const SignupView = () => {
  const [step, setStep] = useState<number>(0);
  const [payload, setPayload] = useState<LoginPayload>(emptyLoginPayload);
  const [valid, setValid] = useState<boolean>(false);

  const forms = [
    { label: "Basic Information", component: UserIdentification },
    { label: "User Personalization", component: UserPersonalization }
  ];
  // Gets the current component from the array
  const Current = forms[step].component;

  // Switches to the next value in the array (the next step)
  const onForward = () => {
    setStep(step + 1);
  }

  // Switches to the previous value in the array (the previous step)
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
            <div className="flex items-center justify-between gap-x-8">
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
                // disabled={!valid}
              />
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}

export default SignupView;