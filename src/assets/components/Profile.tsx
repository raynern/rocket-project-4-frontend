import { useAuth0 } from "@auth0/auth0-react";
import { terminal } from "virtual:terminal";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  terminal.log("auth state is: ", isAuthenticated);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  terminal.log("user is: ", user);
  return (
    isAuthenticated && (
      <div className="flex flex-row items-center space-x-3">
        <img
          className="mask mask-squircle w-8"
          src={user.picture}
          alt={user.name}
        />
        <p className="hidden sm:block">{user.name}</p>
      </div>
    )
  );
};

export default Profile;
