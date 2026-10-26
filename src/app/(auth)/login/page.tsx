"use client";

import Image from "next/image";
import { AuthCard } from "@/app/(auth)/_components/AuthCard";
import { PersonIcon } from "@radix-ui/react-icons";
import { IconBlock } from "@/app/(auth)/_components/IconBlock";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { signIn } from "@/lib/supabase/signIn";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * login is when a user already has an account, and signup is when a user
 * does not have an account
 *
 * Signing up is much more involved. It will be a multistep process and will include questionnaire
 */

const SignInView = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // someone who is already logged in has no reason to see the login page
  useEffect(() => {
    if (!authLoading && user) router.replace("/home");
  }, [authLoading, user, router]);

  const handleSignUpRedirect = () => {
    router.push("/signup");
  };

  // signs the user in with Supabase 
  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Enter your email and password");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setMessage(error);
      return;
    }

    router.push("/home");
  };

  return (
    <div className="flex min-h-screen w-full">
      <Image
        src="/images/placeholder_login.jpeg"
        width={1000}
        height={1000}
        alt="login"
        className="hidden object-cover lg:sticky lg:top-0 lg:block lg:h-screen lg:w-1/2 xl:w-7/12"
      />
      <div className="bg-light-background flex h-full w-full flex-col items-center p-4 lg:h-screen lg:w-1/2 lg:p-8 xl:w-5/12">
        <div className="my-auto flex h-full w-full flex-col justify-center gap-y-8 border-black/10 lg:max-h-full lg:overflow-y-auto lg:border lg:p-8">
          <AuthCard primary={true}>
            <IconBlock icon={<PersonIcon height={40} width={40} />} />
            <div className="flex flex-col gap-y-2">
              <h3>Sign in with email</h3>
              <p>Please sign in to your account to continue</p>
            </div>
            <form onSubmit={handleSignIn} className="flex flex-col gap-y-8">
              <div className="flex flex-col gap-y-4">
                <FormInput
                  label="Email"
                  placeholder="Enter your email address"
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  errorMessage="You must enter a valid email address"
                />
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  errorMessage="You must enter your password"
                />
                {/* TODO: Implement forgot password, right now it does nothing */}
                <a href="/" className="-mt-2 ml-auto text-sm">
                  Forgot your password?
                </a>
              </div>
              <Button primary label={loading ? "Signing in..." : "Sign in"} type="submit" disabled={loading} />
              {message && <span className="text-sm">{message}</span>}
            </form>
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
