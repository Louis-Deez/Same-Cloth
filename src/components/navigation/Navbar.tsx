import {Button} from "@/components/Button";

const Navbar = () => {
  return (
    <div className="w-full bg-white p-4 fixed border border-black/10 border-b-1 px-14 justify-between flex items-center">
      <h1 className="text-2xl text-accent">Same Cloth</h1>
      <div className="flex gap-x-12">
        <p>Home</p>
        <p>Groups</p>
        <p>Communities</p>
        <p>Shop</p>
      </div>
      <Button label="Login" primary />
    </div>
  )
}

export default Navbar;