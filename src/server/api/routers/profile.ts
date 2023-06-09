import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )

    .query(async ({ input }) => {
      const totalUsers=await clerkClient.users.getUserList()
      const user=totalUsers.filter((item)=>item.firstName==input.username)[0]

      // const [user] = await clerkClient.users.getUserList({
      //   username: [input.username],
      // });
     
    
        if (!user) {
          console.log(user,'profile user')
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "user not found",
          });
        }

      return filterUserForClient(user);
    }),
});
