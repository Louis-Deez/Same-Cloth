import { ProfileSidebar } from "@/app/(main)/profile/_components/ProfileSidebar";

/**
 * @component - This is the profile page. It shows the user's profile via the ProfileSidebar component, and the user's
 * posts via the PostsGrid component.
 */

const ProfileView = () => {
  return (
    <div className="flex min-h-screen w-full">
      <ProfileSidebar />
      {/* TODO: implement posts grid */}
      <div className="flex w-full items-center justify-center">
        <h5>You have not posted anything.</h5>
      </div>
    </div>
  );
};

export default ProfileView;
