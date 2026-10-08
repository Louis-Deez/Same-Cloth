import Image from "next/image";
import {AuthCard} from "@/app/(auth)/login/_components/AuthCard";
import {PersonIcon} from "@radix-ui/react-icons";
import {IconBlock} from "@/app/(auth)/login/_components/IconBlock";

const Signup = () => {
  return (
    <div className="flex h-screen w-screen">
      <Image
        src="/images/placeholder_login.jpeg"
        width={1000}
        height={1000}
        alt="login"
        className="object-cover w-5/8"
      />
      <div className="flex p-8 w-1/2 flex-col justify-center items-center bg-white">
        <div className="border border-black/10 w-full h-full p-8">
          <AuthCard>
            <IconBlock icon={<PersonIcon height={40} width={40}/>}/>
            <div className="flex flex-col gap-y-2">
              <h3>Sign in with email</h3>
              <p>Please sign in to your account to continue</p>
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}

export default Signup;