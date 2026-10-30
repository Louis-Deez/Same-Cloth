"use client";

import { AuthCard } from "@/app/(auth)/_components/AuthCard";
import UserIdentification from "@/app/(auth)/signup/_form/UserIdentification";
import UserPersonalization from "@/app/(auth)/signup/_form/UserPersonalization";
import UserQuestionnaire from "@/app/(auth)/signup/_form/UserQuestionnaire";
import { Button } from "@/components/Button";
import { submitSignup } from "@/lib/supabase/submitSignup";
import { emptyLoginPayload, LoginPayload } from "@/models/login/payload";
import Image from "next/image";
import { useState } from "react";

/**
 * Signup is a multistep process, hence why it is a separate page. Each step is stored inside an array with a label and
 * the corresponding component. The step index determines the current step.
 *
 * @hook step and setStep - This is used to keep track of the current step of the signup process.
 * @hook payload and setPayload - This is used to keep track of the data entered by the user.
 * @hook valid and setValid - This is used to keep track of whether the data entered by the user is valid.
 * @hook message and setMessage - This is used to show the user whether saving worked or what went wrong.
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
  const [message, setMessage] = useState<string>("");

  const forms = [
    { label: "Basic Information", component: UserIdentification },
    { label: "User Personalization", component: UserPersonalization },
    { label: "User Questionnaire", component: UserQuestionnaire },
  ];

  // Gets the current component from the array
  const Current = forms[step].component;
  const isLast = step === forms.length - 1;

  // Switches to the next value in the array (the next step)
  const onForward = () => {
    setStep(step + 1);
  };

  // Switches to the previous value in the array (the previous step)
  const onBack = () => {
    setStep(step - 1);
  };

  // Saves the whole form to the database (see lib/supabase/submitSignup.ts)
  const handleSubmit = async () => {
    const { error } = await submitSignup(payload);
    setMessage(error ?? "Account created!");
  };

  return (
    <div className="flex min-h-screen w-full">
      <Image
        src="/images/placeholder_login.jpeg"
        width={1000}
        height={1000}
        priority
        alt="login"
        className="hidden object-cover lg:sticky lg:top-0 lg:block lg:h-screen lg:w-1/2 xl:w-7/12"
      />
      <div className="bg-light-background flex h-full w-full flex-col items-center p-4 lg:h-screen lg:w-1/2 lg:p-8 xl:w-5/12">
        <div className="my-auto flex h-full w-full flex-col justify-center gap-y-8 border-black/10 lg:max-h-full lg:overflow-y-auto lg:border lg:p-8">
          <AuthCard primary={true}>
            <Current
              data={payload}
              onChange={(updates) => setPayload((prev) => ({ ...prev, ...updates }))}
              onValidChange={setValid}
            />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:gap-x-8">
              <Button className={step !== 0 ? "flex-1" : "hidden"} onClick={onBack} primary label="Go Back" />
              <Button
                className="flex-1"
                onClick={isLast ? handleSubmit : onForward}
                label={isLast ? "Finish" : "Continue"}
                primary
                // disabled={!valid}
              />
              {isLast && (
                <span className="basis-full">
                  By clicking Finish you agree to our Terms of Service and our Privacy Policy
                </span>
              )}
              {message && <span className="basis-full">{message}</span>}
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

export default SignupView;