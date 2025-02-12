import Head from "next/head";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Menue from "@/components/sideBar/Menue/Menue";
import ToastManager from "@/components/UI/Toast/ToastManager";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";

type ComProps = {
  children: React.ReactNode;
};

const Layout: React.FC<ComProps> = ({ children }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const menueItems = [
    {
      icon: <HiOutlineBuildingOffice2 size={16} />,
      title: "Workspace",
      key: "Workspace",
      onClick: () => router.push("/"),
    },
    {
      icon: <IoSettingsOutline size={16} />,
      title: "Settings",
      key: "Settings",
      onClick: () => router.push("/settings"),
    },

 
    {
      icon: <FiLogOut size={16} />,
      title: "Logout",
      key: "Logout",
      onClick: handleSignOut,
    },
  ];

  return (
    <>
      <Head>
        <title>
          {`halfway: AI-Powered Transcriptions and Subtitles for Audio & Video`}
        </title>
      </Head>

      <div className="flex flex-col gap-5 min-h-screen bg-base-200">
        <main className="flex flex-row gap-1">
          <div id="sideBar" className="bg-base-200 min-w-60  h-screen p-2">
            <Menue menueItems={menueItems} />
          </div>
          <div
            id="body"
            className="flex-grow bg-white border-white border-4 p-2 flex flex-col gap-8 mt-12 mb-2 mr-6 rounded-xl w-3/4  overflow-y-auto"
          >
            {children}
          </div>
        </main>
        <ToastManager />
      </div>
    </>
  );
};

export default Layout;
