import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createEditor, Descendant, BaseEditor } from "slate";
import { withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import {
  TranscriptionToStorage,
  Utterance,
} from "@/types/transcriptionDocument";
import { useCreateTranscriptionVersion } from "../hooks/transcription/client/useCreateTranscriptionVersion";
import { v4 as uuid } from "uuid";
import { User, Transcription } from "@prisma/client";
import { produce } from "immer";
import { SessionUser } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
type UtteranceDescendant = Descendant & Utterance;
interface EditorContextProps {
  editor: CustomEditor | null;
  saveDocument: () => Promise<void>;
  setIsDirty: (isDirty: boolean) => void;
  isDirty: boolean;
  initialValue: UtteranceDescendant[] | null; // Allow null here
  setInitialValue: (initialValue: UtteranceDescendant[] | null) => void; // Allow null here
  toastState: {
    type: "isDirty" | "error" | "success" | null | string;
    message?: string;
  } | null;
  setToastState: (
    toastState: {
      type: "isDirty" | "error" | "success" | null | string;
      message?: string;
    } | null
  ) => void;
}

// Create a context
const EditorContext = createContext<EditorContextProps>({
  editor: null,
  saveDocument: async () => {},
  setIsDirty: (isDirty: boolean) => {},
  isDirty: false,
  initialValue: [],
  setInitialValue: (initialValue: Descendant[] | null) => {},
  toastState: null,
  setToastState: (
    toastState: {
      type: "isDirty" | "error" | "success" | null | string;
      message?: string;
    } | null
  ) => {},
});

type ComProps = {
  userData: SessionUser;
  transcriptionRecord: Partial<Transcription>;
  transcriptionData: TranscriptionToStorage;
  children?: React.ReactNode;
};

// Context provider component
export const EditorProvider: React.FC<ComProps> = ({
  children,
  userData,
  transcriptionRecord,
  transcriptionData,
}) => {

  const editor = useMemo(
    () => withReact(withHistory(createEditor() as CustomEditor)),
    []
  );
  const [isDirty, setIsDirty] = useState(false);
  const [toastState, setToastState] = useState<{
    type: "isDirty" | "error" | "success" | null | string;
    message?: string;
  } | null>(null);
  const queryClient = useQueryClient();
  // if (
  //   !transcriptionRecord?.uid ||
  //   !userData?.uid ||
  //   !userData?.workspaces ||
  //   userData?.workspaces[0] === undefined ||
  //   !userData?.workspaces[0]
  // ) {
  //   throw new Error("Transcription data is required");
  // }

  const [initialValue, setInitialValue] = useState<
    UtteranceDescendant[] | null
  >(transcriptionData?.document?.utterances);

  const versionUUID = uuid();

  if (!transcriptionRecord?.id || !userData?.id || !userData?.workspaceId) {
    throw new Error("Transcription ID and User ID are required");
  }

  const { uploadJsonToS3 } = useCreateTranscriptionVersion({
    transcriptionId: transcriptionRecord?.id,

    userId: userData?.id,
    uuid: versionUUID,
    workspaceId: userData?.workspaceId,
  });

  const saveDocument = useCallback(async () => {
    if (!initialValue) {
      throw new Error("Utterance data is required");
    }

    try {
      const updatedTranscriptionData = produce(transcriptionData, (draft) => {
        draft.document.utterances = initialValue;
      });

      await uploadJsonToS3(updatedTranscriptionData);
    } catch (error) {
      console.error("Error uploading file to S3: ", error);
    }

    if (editor && editor.history) {
      HistoryEditor.withoutSaving(editor, () => {
        if (editor.history) {
          editor.history.undos = [];
          editor.history.redos = [];
        }
      });
    }
    setToastState({ type: "success", message: "Transcription saved 🤩" });
    const workspaceId =
      (userData?.workspaceId !== undefined && userData?.workspaceId) || "";
    workspaceId &&
      queryClient.invalidateQueries({
        queryKey: [
          "getTranscriptionByUUID",
          {
            workspaceId: workspaceId,
            transcriptionUUID: transcriptionRecord?.id,
          },
        ],
      });
  }, [
    editor,
    initialValue,
    transcriptionData,
    uploadJsonToS3,
    userData,
    transcriptionRecord,
    queryClient,
  ]);
  const contextValue = useMemo(
    () => ({
      editor,
      saveDocument,
      setIsDirty,
      isDirty,
      initialValue,
      setInitialValue,
      toastState,
      setToastState,
    }),
    [
      editor,
      saveDocument,
      setIsDirty,
      isDirty,
      initialValue,
      setInitialValue,
      toastState,
      setToastState,
    ]
  );

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook to use the editor context
export const useEditor = () => useContext(EditorContext);
