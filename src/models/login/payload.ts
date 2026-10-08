import {emptyUserIdentification, UserIdentificationData} from "@/models/login/data";

export type LoginPayload = UserIdentificationData;

export const emptyLoginPayload: LoginPayload = {
  ...emptyUserIdentification,
}