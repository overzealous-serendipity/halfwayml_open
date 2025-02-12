import React from "react";
import { useSession } from "next-auth/react";
import TranscriptionsList from "@/components/Transciptions/List/TranscriptionsList";
import CreateOrder from "@/components/UI/Modal/BtnOrdersMenue";
import ToastManager from "@/components/UI/Toast/ToastManager";
import Layout from "@/components/Layout/Layout";
import LoadingState from "@/components/UI/UX/LoadingState";
import ErrorState from "@/components/UI/UX/ErrorState";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const workspaceId = session?.user?.workspaceId;
  if (status === "loading") {
    return <LoadingState content="Loading your data ..." />;
  }

  if (status === "unauthenticated") {
    return (
      <ErrorState
        retry={() => {
          router.push("/login");
        }}
        message="Please login to access this page"
      />
    );
  }

  return (
    <Layout>
      <main className="max-h-[600px]">
        <div className="flex-row body flex justify-end">
          <CreateOrder />
        </div>

        <TranscriptionsList workspaceId={workspaceId as string} />
        <ToastManager />
      </main>
    </Layout>
  );
}
