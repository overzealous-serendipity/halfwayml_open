import React, { FC, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Transcription } from "@prisma/client";

import ControlPanel from "@/components/Transciptions/Control/ControlPanel";
import InfoBox from "@/components/Transciptions/InfoBox/InfoBox";
import AudioController from "@/components/Transciptions/AudioPlayer/AudioPlayer";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";

import LoadingState from "@/components/UI/UX/LoadingState";
import { CurrentTimeProvider } from "@/config/util/context/useCurrentTimeContext";
import {
  EditorProvider,
} from "@/config/util/context/useEditorContext";

import Editor from "@/components/Transciptions/Editor/EditorLight";
import GoBack from "@/components/Transciptions/InfoBox/GoBack";
import { useGetTranscriptionByID } from "@/config/util/hooks/transcription/client/useTranscribe";
import ErrorState from "@/components/UI/UX/ErrorState";
import ExportModal from "@/components/Transciptions/Export/ExportModal";


type ComProps = {};

const Index: FC<ComProps> = () => {
  const [transcriptionData, setTranscriptionData] =
    useState<Transcription | null>(null);
  const [mediaURL, setMediaURL] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const { data: session, status } = useSession();
  const router = useRouter();
  const transcriptionUUID = router.query.id as string;

  const {
    data: transcriptionRecord,
    error: transcriptionError,
    isLoading: transcriptionLoading,
  } = useGetTranscriptionByID(transcriptionUUID);


  useEffect(() => {
    const fetchData = async () => {
      if (session?.user && transcriptionRecord) {
        try {
          // Fetch media file from Minio
          const mediaResponse = await fetch(
            `/api/media/${encodeURIComponent(transcriptionRecord.mediaURL)}`
          );

          if (!mediaResponse.ok) {
            throw new Error(`HTTP error! status: ${mediaResponse.status}`);
          }

          const mediaBlob = await mediaResponse.blob();
          const mediaURL = URL.createObjectURL(mediaBlob);

          if(!transcriptionRecord.lastVersionURL) {
            throw new Error("No last version URL found");
          }

          // Get transcription content

          const contentResponse = await fetch(
            `/api/media/${encodeURIComponent(
                transcriptionRecord.lastVersionURL
            )}`
          );



          if (!contentResponse.ok) {
            throw new Error(`HTTP error! status: ${contentResponse.status}`);
          }

          const transcriptionData = await contentResponse.json();

          setMediaURL(mediaURL);
          setTranscriptionData(transcriptionData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [session, transcriptionRecord]);

  const MemoizedAudioController = React.memo(AudioController);
  if (isLoading || transcriptionLoading) {
    return (
      <LoadingState
        content="
      Loading transcription data ...
    "
      />
    );
  }
  if (transcriptionError) {
    return <ErrorState />;
  }

  return (
    <>
      <Head>
        <title>
          {`  halfway: AI-Powered Transcriptions and Subtitles for Audio & Video`}
        </title>
      </Head>

      {session?.user && transcriptionRecord && transcriptionData && (
        <>
          <EditorProvider
            userData={session.user as any}
            transcriptionRecord={transcriptionRecord as any}
            transcriptionData={transcriptionData as any}
          >
            <CurrentTimeProvider>

              <main className="flex flex-col gap-7 mx-auto p-2 min-h-screen">
                <div id="header" className="flex flex-row justify-between">
                  <GoBack />

                  {transcriptionRecord && (
                    <ControlPanel
                      transcriptionRecord={transcriptionRecord as any}
                      setShowExportModal={setShowExportModal}
                    />
                  )}
                </div>

                {/* Info Box */}
                <div id="info-box" className="max-w-3xl mx-auto">
                  <div className="max-w-2xl ml-28 ">
                    <InfoBox transcriptionRecord={transcriptionRecord as any} />
                  </div>
                </div>

                <div className="self-center">
                  {transcriptionRecord && transcriptionData && session.user ? (
                    <div className="flex flex-col gap-10">
                      <Editor />

                      <div className="fixed bottom-0 left-0 w-full z-50">
                        <MemoizedAudioController audio={mediaURL} />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <ExportModal
                  setShowExportModal={setShowExportModal}
                  showExportModal={showExportModal}
                  transcriptionRecord={transcriptionRecord as any}
                />
                <div className="h-72" id="footer"></div>
              </main>
            </CurrentTimeProvider>
          </EditorProvider>
        </>
      )}
    </>
  );
};

export default React.memo(Index);
