import Image from "next/image";
import {AuthCard} from "@/app/(auth)/login/_components/AuthCard";

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
            <h1>Sign Up</h1>
            <h2>Sign Up</h2>
            <h3>Sign Up</h3>
            <h4>Sign Up</h4>
            <h5>Sign Up</h5>
            <p>Sign Up</p>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}

export default Signup;