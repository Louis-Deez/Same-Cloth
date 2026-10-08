export interface UserIdentificationData {
  firstName: string;
  lastName: string;
  handle: string;
  email: string;
  password: string;
  confirmPassword: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  country: string;
  gender: string;
}

export const emptyUserIdentification: UserIdentificationData = {
  firstName: "",
  lastName: "",
  handle: "",
  email: "",
  password: "",
  confirmPassword: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  country: "",
  gender: "",
}