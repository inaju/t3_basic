import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import LoadingSpinner, { LoadingPage } from "~/components/loading";
import { Post } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "./layout";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const [input, setInput] = useState<string>("");

  const { user } = useUser();
  if (!user) return null;
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      setInput("");
      await ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0]);
      else {
        toast.error("Failed to Post!! Please Try again Later");
      }
    },
  });

  return (
    <div className="flex w-full gap-4">
      <Image
        className="flex h-12 w-12 rounded-full"
        src={user.profileImageUrl}
        alt={`@${user.username as string}'s profile image`}
        width={48}
        height={48}
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        value={input}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        onChange={(e) => setInput(e.target.value)}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex gap-3 border-b border-slate-400 p-8">
      <Image
        alt="author image"
        src={author.profileImageUrl}
        className="flex h-12 w-12 rounded-full"
        width={48}
        height={48}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>@{author.username}</span>{" "}
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">
              {` .  ${dayjs(post.createdAt).fromNow()}`}{" "}
            </span>
          </Link>
        </div>
        <span>{post.content} </span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();
  const dataEntry = data!;
  if (postLoading) return <LoadingPage />;

  if (!dataEntry) return <div>something went wrong</div>;

  return (
    <div className="flex flex-col justify-center">
      {dataEntry?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { data } = api.posts.getAll.useQuery();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  if (!userLoaded) return <div />;
  // if (!postLoaded && !userLoaded) return <LoadingPage />;

  return (
    <>
    <PageLayout>
    <div className="border-b border-slate-400 p-4 ">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!isSignedIn && <SignOutButton />}
            {!!isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
          </PageLayout>

    </>
  );
};

export default Home;
