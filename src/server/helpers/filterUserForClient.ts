import { User } from "@clerk/nextjs/dist/types/server";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.firstName,
    firstName: user.firstName,
    profileImageUrl: user.profileImageUrl,
  };
};
