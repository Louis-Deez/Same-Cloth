export interface UserIdentificationData {
  firstName: string;
  lastName: string;
  handle: string;
  email: string;
  password: string;
  confirmPassword: string;
  dobDay: number;
  dobMonth: number;
  dobYear: number;
  county: string;
  gender: string;
}

export const emptyUserIdentification: UserIdentificationData = {
  firstName: "",
  lastName: "",
  handle: "",
  email: "",
  password: "",
  confirmPassword: "",
  dobDay: 0,
  dobMonth: 0,
  dobYear: 0,
  county: "",
  gender: "",
}