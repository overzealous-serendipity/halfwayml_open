import React, { FC } from "react";
import { useRouter } from "next/router";
import {
  useGetTranscriptionByID,
  useGetTranscriptionVersions,
  useUpdateTranscription,
} from "@/config/util/hooks/transcription/client/useTranscribe";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useGetUserRecord } from "@/config/util/hooks/global/useGlobal";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { showToast } from "@/config/redux/store/toastSlice";
import LoadingState from "@/components/UI/UX/LoadingState";
import ErrorState from "@/components/UI/UX/ErrorState";
import Head from "next/head";

interface Version {
  id: string;
  versionNumber: number;
  url: string;
  transcriptionId: string;
  createdAt: string;
  createdBy: {
    name: string | null;
    email: string;
  };
}

const Index: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const { data: userData, isLoading: userLoading } = useGetUserRecord();
  const {
    data: versions,
    isLoading,
    error,
  } = useGetTranscriptionVersions(id as string);
  const { data: transcription } = useGetTranscriptionByID(id as string);
  const updateTranscription = useUpdateTranscription();
  const handleVersionSelect = async (version: Version) => {
    try {
      await updateTranscription.mutateAsync({
        id: id as string,
        data: {
          lastVersionURL: version.url,
        },
      });

      router.push(`/transcription/${id}`);
    } catch (error) {
      console.error("Error switching version:", error);
    }
  };

  if (isLoading || userLoading)
    return <LoadingState content="Loading version history..." />;
  if (error) {
    return (
      <ErrorState
        message="Error loading data. Please try refreshing the page."
        retry={() => router.reload()}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Version History - {transcription?.title}</title>
      </Head>

      <main className="flex flex-col gap-7 mx-auto min-h-screen max-w-4xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <IoMdArrowRoundBack size={24} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold">Version History</h1>
            <div className="w-[88px]" /> {/* Spacer for alignment */}
          </div>
          <p className="text-gray-600 text-center">
            Select a version to restore your transcription to that point in
            time.
          </p>
        </div>

        {/* Versions List */}
        <div className="space-y-4">
          {versions?.map((version: Version) => (
            <div
              key={version.id}
              className={`p-4 rounded-lg border ${
                transcription?.lastVersionURL === version.url
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              } transition-all cursor-pointer`}
              onClick={() => handleVersionSelect(version)}
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    Version {version.versionNumber}
                    {transcription?.lastVersionURL === version.url && (
                      <span className="ml-2 text-purple-600 text-sm">
                        (Current)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created by{" "}
                    {version.createdBy.name || version.createdBy.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(
                      new Date(version.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    transcription?.lastVersionURL === version.url
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 hover:bg-purple-500 hover:text-white"
                  }`}
                >
                  {transcription?.lastVersionURL === version.url
                    ? "Current"
                    : "Restore"}
                </button>
              </div>
            </div>
          ))}

          {versions?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No versions available yet.
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Index;
