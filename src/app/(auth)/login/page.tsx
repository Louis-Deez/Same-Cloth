import Image from "next/image";

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

        </div>
      </div>
    </div>
  )
}

export default Signup;