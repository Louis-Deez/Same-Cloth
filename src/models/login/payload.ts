import {emptyUserIdentification, UserIdentification} from "@/models/login/data";

export type LoginPayload = UserIdentification;

export const emptyLoginPayload: LoginPayload = {
  ...emptyUserIdentification,
}