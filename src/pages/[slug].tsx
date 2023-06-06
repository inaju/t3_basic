import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const ProfilePage: NextPage = () => {
  // if (!postLoaded && !userLoaded) return <LoadingPage />;
  const { data, isLoading } = api.profile.getUserByUserName.useQuery({
    username: "Mitchel",
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div>Profile View</div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
