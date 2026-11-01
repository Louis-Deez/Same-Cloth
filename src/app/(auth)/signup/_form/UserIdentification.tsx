"use client";

import { UserIdentificationData } from "@/models/login/data";
import { useEffect } from "react";
import { IconBlock } from "@/app/(auth)/_components/IconBlock";
import { PersonIcon } from "@radix-ui/react-icons";
import { FormInput } from "@/components/form/FormInput";
import { SingleSelect } from "@/components/form/FormSelection";
import { COUNTRIES, GENDER } from "@/app/(auth)/signup/_config/fields";

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
    onValidChange(
      firstNameValid &&
        lastNameValid &&
        emailValid &&
        passwordValid &&
        confirmPasswordValid &&
        dobValid &&
        countyValid &&
        genderValid,
    );
  }, [
    firstNameValid,
    lastNameValid,
    emailValid,
    passwordValid,
    confirmPasswordValid,
    dobValid,
    countyValid,
    genderValid,
    onValidChange,
  ]);

  return (
    <section className="flex flex-col gap-y-8">
      <IconBlock icon={<PersonIcon height={40} width={40} />} />
      <div className="flex flex-col gap-y-2">
        <h3>Who are you?</h3>
        <p>Create a new account with Same Cloth</p>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className="grid grid-cols-2 gap-x-5 gap-y-5">
          <FormInput
            label="First Name"
            placeholder="Enter your first name"
            id="firstName"
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            required
            errorMessage="You must enter your first name"
            className="col-span-2 lg:col-span-1"
            validated={firstNameValid}
            type="text"
          />
          <FormInput
            label="Last Name"
            placeholder="Enter your last name"
            id="lastName"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            required
            errorMessage="You must enter your last name"
            className="col-span-2 lg:col-span-1"
            validated={lastNameValid}
            type="text"
          />
        </div>
        <FormInput
          label="Email"
          placeholder="Enter your email address"
          id="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          required
          errorMessage="You must enter a valid email address"
          validated={emailValid}
          type="email"
        />
        <FormInput
          label="Password"
          placeholder="Enter your password"
          id="password"
          value={data.password}
          onChange={(e) => onChange({ ...data, password: e.target.value })}
          required
          errorMessage="You must enter your password"
          validated={passwordValid}
          type="password"
        />
        <FormInput
          label="Confirm Password"
          placeholder="Confirm your password"
          id="confirmPassword"
          value={data.confirmPassword}
          onChange={(e) => onChange({ ...data, confirmPassword: e.target.value })}
          required
          errorMessage="You must confirm your password"
          validated={confirmPasswordValid}
          type="password"
        />
        <div className="flex flex-col gap-y-1">
          <label>Date of Birth</label>
          <div className="grid grid-cols-3 gap-x-5">
            <FormInput
              inputMode="numeric"
              placeholder="MM"
              id="dobMonth"
              value={data.dobMonth}
              onChange={(e) => onChange({ ...data, dobMonth: e.target.value.replace(/[^0-9]/g, "") })}
              required
              errorMessage="Invalid Month"
              className="col-span-1"
              validated={dobValid}
              type="number"
            />
            <FormInput
              inputMode="numeric"
              placeholder="DD"
              id="dobDay"
              value={data.dobDay}
              onChange={(e) => onChange({ ...data, dobDay: e.target.value.replace(/[^0-9]/g, "") })}
              required
              errorMessage="Invalid Day"
              className="col-span-1"
              validated={dobValid}
              type="number"
            />
            <FormInput
              inputMode="numeric"
              placeholder="YYYY"
              id="dobYear"
              value={data.dobYear}
              onChange={(e) => onChange({ ...data, dobYear: e.target.value.replace(/[^0-9]/g, "") })}
              required
              errorMessage="Invalid Year"
              className="col-span-1"
              validated={dobValid}
              type="number"
            />
          </div>
        </div>
        <SingleSelect
          id="country"
          label="Country"
          options={COUNTRIES}
          onChange={(value) => onChange({ ...data, country: value })}
          value={data.country}
          placeholder="Select your country"
          required
          errorMessage="You must select your country"
          validated={countyValid}
        />
        <SingleSelect
          id="gender"
          label="Gender"
          options={GENDER}
          onChange={(value) => onChange({ ...data, gender: value })}
          value={data.gender}
          placeholder="Select your gender"
          required
          errorMessage="You must select your gender"
          validated={genderValid}
        />
      </div>
    </section>
  );
};

export default UserIdentification;
