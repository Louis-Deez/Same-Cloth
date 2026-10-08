"use client"

import {UserIdentificationData} from "@/models/login/data";
import {useEffect} from "react";
import {IconBlock} from "@/app/(auth)/_components/IconBlock";
import {PersonIcon} from "@radix-ui/react-icons";

interface UserIdentificationProps {
  data: UserIdentificationData
  onChange: (data: UserIdentificationData) => void
  onValidChange: (valid: boolean) => void
}

const UserIdentification = ({ data, onChange, onValidChange }: UserIdentificationProps) => {
  const firstNameValid = data.firstName.length > 0;
  const lastNameValid = data.lastName.length > 0;
  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email);
  const passwordValid = data.password.length > 0;
  const confirmPasswordValid = data.confirmPassword === data.password;
  const dobValid = data.dobDay > 0 && data.dobMonth > 0 && data.dobYear > 0;
  const countyValid = data.county.length > 0;
  const genderValid = data.gender.length > 0;

  useEffect(() => {
    onValidChange(firstNameValid && lastNameValid && emailValid && passwordValid && confirmPasswordValid && dobValid && countyValid && genderValid);
  }, [firstNameValid, lastNameValid, emailValid, passwordValid, confirmPasswordValid, dobValid, countyValid, genderValid, onValidChange])

  return (
    <section>
      <IconBlock icon={<PersonIcon height={40} width={40} />} />
      <div className="flex flex-col gap-y-2">
        <h3>Who are you?</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
    </section>
  )
}

export default UserIdentification;