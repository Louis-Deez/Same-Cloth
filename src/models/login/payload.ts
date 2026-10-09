import {
  emptyUserIdentification,
  emptyUserPersonalization,
  UserIdentificationData,
  UserPersonalizationData,
} from "@/models/login/data";

export type LoginPayload = UserIdentificationData & UserPersonalizationData;

export const emptyLoginPayload: LoginPayload = {
  ...emptyUserIdentification,
  ...emptyUserPersonalization,
};
