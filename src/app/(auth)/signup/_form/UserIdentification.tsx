"use client"

import {UserIdentificationData} from "@/models/login/data";
import {useEffect} from "react";
import {IconBlock} from "@/app/(auth)/_components/IconBlock";
import {PersonIcon} from "@radix-ui/react-icons";
import {FormInput} from "@/components/form/FormInput";

interface UserIdentificationProps {
  data: UserIdentificationData;
  onChange: (data: UserIdentificationData) => void;
  onValidChange: (valid: boolean) => void;
}

const UserIdentification = ({ data, onChange, onValidChange }: UserIdentificationProps) => {
  const firstNameValid = data.firstName.length > 0;
  const lastNameValid = data.lastName.length > 0;
  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email);
  const passwordValid = data.password.length > 0;
  const confirmPasswordValid = data.confirmPassword === data.password;
  const dobValid = data.dobDay.length > 0 && data.dobMonth.length > 0 && data.dobYear.length > 0;
  const countyValid = data.country.length > 0;
  const genderValid = data.gender.length > 0;

  useEffect(() => {
    onValidChange(firstNameValid && lastNameValid && emailValid && passwordValid && confirmPasswordValid && dobValid && countyValid && genderValid);
  }, [firstNameValid, lastNameValid, emailValid, passwordValid, confirmPasswordValid, dobValid, countyValid, genderValid, onValidChange])

  return (
    <section className="flex flex-col gap-y-8">
      <IconBlock icon={<PersonIcon height={40} width={40} />} />
      <div className="flex flex-col gap-y-2">
        <h3>Who are you?</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className="grid-cols-2 grid gap-x-5">
          <FormInput
            label="First Name"
            placeholder="Enter your first name"
            id="firstName"
            value={data.firstName}
            onChange={(e) => onChange({...data, firstName: e.target.value})}
            required
            errorMessage="You must enter your first name"
            className="col-span-2 lg:col-span-1"
          />
          <FormInput
            label="Last Name"
            placeholder="Enter your last name"
            id="lastName"
            value={data.lastName}
            onChange={(e) => onChange({...data, lastName: e.target.value})}
            required
            errorMessage="You must enter your last name"
            className="col-span-2 lg:col-span-1"
          />
        </div>
        <FormInput
          label="Handle"
          placeholder="Enter your handle (it must be unique)"
          id="handle"
          value={data.handle}
          onChange={(e) => onChange({...data, handle: e.target.value})}
          required
          errorMessage="You must enter a unique handle"
        />
        <FormInput
          label="Email"
          placeholder="Enter your email address"
          id="email"
          value={data.email}
          onChange={(e) => onChange({...data, email: e.target.value})}
          required
          errorMessage="You must enter a valid email address"
        />
        <div className="flex flex-col gap-y-1">
          <label>Date of Birth</label>
          <div className="grid-cols-3 grid gap-x-5">
            <FormInput
              inputMode="numeric"
              placeholder="MM"
              id="dobMonth"
              value={data.dobMonth}
              onChange={(e) => onChange({...data, dobMonth: e.target.value.replace(/[^0-9]/g, "")})}
              required
              errorMessage="Invalid Month"
              className="col-span-1"
            />
            <FormInput
              inputMode="numeric"
              placeholder="DD"
              id="dobDay"
              value={data.dobDay}
              onChange={(e) => onChange({...data, dobDay: e.target.value.replace(/[^0-9]/g, "")})}
              required
              errorMessage="Invalid Day"
              className="col-span-1"
            />
            <FormInput
              inputMode="numeric"
              placeholder="YYYY"
              id="dobYear"
              value={data.dobYear}
              onChange={(e) => onChange({...data, dobYear: e.target.value.replace(/[^0-9]/g, "")})}
              required
              errorMessage="Invalid Year"
              className="col-span-1"
            />
          </div>
        </div>
        <FormInput
          label="Country"
          inputMode="text"
          placeholder="e.g., United States"
          id="country"
          value={data.country}
          onChange={(e) => onChange({...data, country: e.target.value.replace(/[^a-zA-Z]/g, "")})}
          required
          errorMessage="You must enter your country"
        />
        <FormInput
          label="Gender"
          placeholder="Enter your gender"
          id="gender"
          value={data.gender}
          onChange={(e) => onChange({...data, gender: e.target.value})}
          required
          errorMessage="You must enter your gender"
          type="password"
        />
      </div>
    </section>
  )
}

export default UserIdentification;