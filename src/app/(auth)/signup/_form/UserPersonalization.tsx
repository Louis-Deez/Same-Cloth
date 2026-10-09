import {UserPersonalizationData} from "@/models/login/data";
import {IconBlock} from "@/app/(auth)/_components/IconBlock";
import {HamburgerMenuIcon, PlusIcon} from "@radix-ui/react-icons";
import {FormInput} from "@/components/FormInput";

interface UserPersonalizationProps {
  data: UserPersonalizationData;
  onChange: (updates: Partial<UserPersonalizationData>) => void;
  onValidChange: (valid: boolean) => void;
}

const UserPersonalization = ({ data, onChange, onValidChange }: UserPersonalizationProps) => {
  return (
    <section className="flex flex-col gap-y-8">
      <IconBlock icon={<HamburgerMenuIcon height={40} width={40} />} />
      <div className="flex flex-col gap-y-2">
        <h3>Personalize your account</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
      <div className="flex items-center gap-x-5">
        <div className="p-9 border border-black/20 border-dashed rounded-3xl">
          <PlusIcon className="scale-150 text-black/50"/>
        </div>
        <div className="flex flex-col gap-y-2">
          <h5>Profile Picture</h5>
          <span>Choose a profile picture that represents you best, you can always change it later.</span>
        </div>
      </div>
      <FormInput
        label="Display Name"
        placeholder="Enter your display name"
        id="displayName"
        value={data.displayName}
        onChange={(e) => onChange({displayName: e.target.value})}
        required
        errorMessage="You must enter your display name"
      />
    </section>
  )
}

export default UserPersonalization;