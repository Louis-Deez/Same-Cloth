import Image from "next/image";
import {AuthCard} from "@/app/(auth)/login/_components/AuthCard";
import {PersonIcon} from "@radix-ui/react-icons";
import {IconBlock} from "@/app/(auth)/login/_components/IconBlock";
import {FormInput} from "@/components/FormInput";
import {Button} from "@/components/Button";

const Signup = () => {
  return (
    <div className="flex h-screen w-screen">
      <Image
        src="/images/placeholder_login.jpeg"
        width={1000}
        height={1000}
        alt="login"
        className="object-cover w-7/9"
      />
      <div className="flex p-8 w-1/2 flex-col justify-center items-center bg-light-background">
        <div className="flex flex-col border border-black/10 w-full h-full p-8 gap-y-8">
          <AuthCard primary={true}>
            <IconBlock icon={<PersonIcon height={40} width={40}/>}/>
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
              <a href="/" className="-mt-2 ml-auto text-sm">Forgot your password?</a>
            </div>
            <Button label="Sign in"/>
          </AuthCard>
          <AuthCard primary={false}>
            <div className="flex flex-col gap-y-2">
              <h3>No account?</h3>
              <p>You can sign up within minutes to get started</p>
            </div>
            <Button label="Create Account with Email"/>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}

export default Signup;