"use client"

import {UserQuestionnaireData} from "@/models/login/data";
import {IconBlock} from "@/app/(auth)/_components/IconBlock";
import {QuestionMarkIcon} from "@radix-ui/react-icons";
import {MultiSelect} from "@/components/form/FormSelection";
import {INTERESTS} from "@/app/(auth)/signup/_config/fields";

interface UserQuestionnaireProps {
  data: UserQuestionnaireData;
  onChange: (updates: Partial<UserQuestionnaireData>) => void;
  onValidChange: (valid: boolean) => void;
}

const UserQuestionnaire = ({data, onChange, onValidChange}: UserQuestionnaireProps) => {
  return (
    <section className="flex flex-col gap-y-8">
      <IconBlock icon={<QuestionMarkIcon height={40} width={40}/>}/>
      <div className="flex flex-col gap-y-2">
        <h3>Tell us about yourself</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
      <div className="flex flex-col gap-y-5">
        <MultiSelect
          id="interests"
          label="Interests"
          options={INTERESTS}
          onChange={(value) => onChange({interests: value})}
          value={data.interests}
          placeholder="Select your interests"
          required
          errorMessage="You must select at least one interest"
          validated={data.interests.length > 0}
        />
      </div>
    </section>
  )
}

export default UserQuestionnaire;