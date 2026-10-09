import {
  emptyUserIdentification,
  emptyUserPersonalization, emptyUserQuestionnaire,
  UserIdentificationData,
  UserPersonalizationData, UserQuestionnaireData,
} from "@/models/login/data";

export type LoginPayload = UserIdentificationData & UserPersonalizationData & UserQuestionnaireData;

export const emptyLoginPayload: LoginPayload = {
  ...emptyUserIdentification,
  ...emptyUserPersonalization,
  ...emptyUserQuestionnaire,
};
