import { ProfileSidebar } from "@/app/(main)/profile/_components/ProfileSidebar";
import { PostsGrid } from "@/app/(main)/profile/_components/PostsGrid";

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
        <PostsGrid />
      </div>
    </div>
  );
};

export default ProfileView;
