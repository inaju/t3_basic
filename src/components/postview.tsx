import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
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