"use client";

import { UserQuestionnaireData } from "@/models/login/data";
import { IconBlock } from "@/app/(auth)/_components/IconBlock";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { MultiSelect } from "@/components/form/FormSelection";
import {
  CLOTHING_AESTHETICS,
  CLOTHING_NEEDS,
  COLOR_PREFERENCES,
  FASHION_ERAS,
  INTERESTS,
  STYLE_SUBCULTURES,
} from "@/app/(auth)/signup/_config/fields";
import { useEffect } from "react";

interface UserQuestionnaireProps {
  data: UserQuestionnaireData;
  onChange: (updates: Partial<UserQuestionnaireData>) => void;
  onValidChange: (valid: boolean) => void;
}

const UserQuestionnaire = ({ data, onChange, onValidChange }: UserQuestionnaireProps) => {
  const interestsValid = data.interests.length > 0;
  const clothingAestheticsValid = data.clothingAesthetics.length > 0;
  const clothingNeedsValid = data.clothingNeeds.length > 0;
  const colorPreferenceValid = data.colorPreference.length > 0;
  const fashionEraValid = data.fashionEra.length > 0;
  const subCultureValid = data.subculture.length > 0;

  useEffect(() => {
    onValidChange(
      interestsValid &&
        clothingAestheticsValid &&
        clothingNeedsValid &&
        colorPreferenceValid &&
        fashionEraValid &&
        subCultureValid,
    );
  }, [
    interestsValid,
    clothingAestheticsValid,
    clothingNeedsValid,
    colorPreferenceValid,
    fashionEraValid,
    subCultureValid,
    onValidChange,
  ]);

  return (
    <section className="flex flex-col gap-y-8">
      <IconBlock icon={<QuestionMarkIcon height={40} width={40} />} />
      <div className="flex flex-col gap-y-2">
        <h3>Tell us about yourself</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
      <div className="flex flex-col gap-y-5">
        <MultiSelect
          id="interests"
          label="What interests influence your style?"
          options={INTERESTS}
          onChange={(value) => onChange({ interests: value })}
          value={data.interests}
          placeholder="Select your interests"
          required
          errorMessage="You must select at least one interest"
          validated={interestsValid}
        />
        <MultiSelect
          id="clothingAesthetics"
          label="Which words describe how you want your clothing to feel"
          options={CLOTHING_AESTHETICS}
          onChange={(value) => onChange({ clothingAesthetics: value })}
          value={data.clothingAesthetics}
          placeholder="Select your clothing aesthetics"
          required
          errorMessage="You must select at least one clothing aesthetics"
          validated={clothingAestheticsValid}
        />
        <MultiSelect
          id="clothingNeeds"
          label="What should we consider when recommending clothing?"
          options={CLOTHING_NEEDS}
          onChange={(value) => onChange({ clothingNeeds: value })}
          value={data.clothingNeeds}
          placeholder="Select your clothing needs"
          required
          errorMessage="You must select at least one clothing needs"
          validated={clothingNeedsValid}
        />
        <MultiSelect
          id="colorPreference"
          label="Which colors are you most drawn to? "
          options={COLOR_PREFERENCES}
          onChange={(value) => onChange({ colorPreference: value })}
          value={data.colorPreference}
          placeholder="Select your color preference"
          required
          errorMessage="You must select at least one color preference"
          validated={colorPreferenceValid}
        />
        <MultiSelect
          id="fashionEra"
          label="Which fashion era inspires you?"
          options={FASHION_ERAS}
          onChange={(value) => onChange({ fashionEra: value })}
          value={data.fashionEra}
          placeholder="Select your fashion era"
          required
          errorMessage="You must select at least one fashion era"
          validated={fashionEraValid}
        />
        <MultiSelect
          id="subculture"
          label="Which styles or subcultures interest you?"
          options={STYLE_SUBCULTURES}
          onChange={(value) => onChange({ subculture: value })}
          value={data.subculture}
          placeholder="Select your subculture"
          required
          errorMessage="You must select at least one subculture"
          validated={subCultureValid}
        />
      </div>
    </section>
  );
};

export default UserQuestionnaire;
