"use client";

import Image from "next/image";
import { AuthCard } from "@/app/(auth)/_components/AuthCard";
import { PersonIcon } from "@radix-ui/react-icons";
import { IconBlock } from "@/app/(auth)/_components/IconBlock";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

/**
 * An important distinction should be made here: login is when a user already has an account, and signup is when a user
 * does not have an account, although the structure is a little different. The signup option is part of the login page,
 * but the signup page itself is a separate page.
 *
 * Signing up is much more involved. It will be a multistep process and will include questionnaires.
 *
 * @IMPORTANT - The website is currently not fully functional. Clicking on a button does nothing for now.
 */

const SignInView = () => {
  const router = useRouter();

  const handleSignUpRedirect = () => {
    router.push("/signup");
  };

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
        <div className="flex h-full w-full flex-col gap-y-8 overflow-y-auto border border-black/10 p-8">
          <AuthCard primary={true}>
            <IconBlock icon={<PersonIcon height={40} width={40} />} />
            <div className="flex flex-col gap-y-2">
              <h3>Sign in with email</h3>
              <p>Please sign in to your account to continue</p>
            </div>
            <div className="flex flex-col gap-y-4">
              <FormInput
                label="Email"
                placeholder="Enter your email address"
                id="email"
                value=""
                required
                errorMessage="You must enter a valid email address"
              />
              <FormInput
                label="Password"
                placeholder="Enter your password"
                id="password"
                value=""
                required
                errorMessage="You must enter your password"
              />
              {/* TODO: Implement forgot password, right now it does nothing */}
              <a href="/" className="-mt-2 ml-auto text-sm">
                Forgot your password?
              </a>
            </div>
            <Button primary label="Sign in" />
            <div className="flex items-center gap-x-2 text-sm">
              <div className="flex-1 border-t border-black/10" />
              <span className="!text-black/50">Or sign in with</span>
              <div className="flex-1 border-t border-black/10" />
            </div>
            <div className="flex items-center gap-x-8">
              <Button icon={<Image src="/icons/google.svg" alt="Google" width={24} height={24} loading="eager" />} />
              <Button icon={<Image src="/icons/apple.svg" alt="Google" width={18} height={22} loading="eager" />} />
            </div>
          </AuthCard>
          <AuthCard primary={false}>
            <div className="flex flex-col gap-y-2">
              <h3>No account?</h3>
              <p>You can sign up within minutes to get started</p>
            </div>
            <Button primary label="Create Account with Email" onClick={handleSignUpRedirect} type="button" />
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

export default SignInView;
