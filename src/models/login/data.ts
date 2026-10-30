export interface UserIdentificationData {
  firstName: string;
  lastName: string;
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
  email: "",
  password: "",
  confirmPassword: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  country: "",
  gender: "",
};

export interface UserPersonalizationData {
  // add another field that takes the user's profile picture
  displayName: string;
  handle: string;
  bio: string;
}

export const emptyUserPersonalization: UserPersonalizationData = {
  displayName: "",
  handle: "",
  bio: "",
};

export interface UserQuestionnaireData {
  interests: string[];
  clothingAesthetics: string[];
  clothingNeeds: string[];
  colorPreference: string[];
  fashionEra: string[];
  subculture: string[];
  // typed (free text) answers, saved to user_written_response. All optional.
  otherStyle: string; // Q11
  outfitExpression: string; // Q10
  anythingElse: string; // Q9
}

export const emptyUserQuestionnaire: UserQuestionnaireData = {
  interests: [],
  clothingAesthetics: [],
  clothingNeeds: [],
  colorPreference: [],
  fashionEra: [],
  subculture: [],
  otherStyle: "",
  outfitExpression: "",
  anythingElse: "",
};
