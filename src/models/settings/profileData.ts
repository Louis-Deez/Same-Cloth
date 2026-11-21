export interface ProfileDataPatch {
  displayName?: string;
  bio?: string;
  profileImage?: File | null;
  bannerImage?: File | null;
  gender?: string;
}
