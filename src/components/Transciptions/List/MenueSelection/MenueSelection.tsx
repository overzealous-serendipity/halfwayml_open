import React, { FC, useState } from "react";
import {
  MdDeleteOutline,
  MdOutlineRadioButtonUnchecked,
  MdRestore,
} from "react-icons/md";

import CustomLocalModal, {
  CustomLocalContent,
} from "@/components/UI/Modal/orders/Transcribe/CustomLocalModal";
import { useDispatch } from "react-redux";
import { showToast } from "@/config/redux/store/toastSlice";
import { useDeleteTranscription } from "@/config/util/hooks/transcription/client/useTranscribe";
import { useQueryClient } from "@tanstack/react-query";
import { Transcription, TranscriptionStatus } from "@/types/transcription";

type ComProps = {
  onUpdateStatus: (
    status: TranscriptionStatus,
    eventDescription: string
  ) => void;
  selectionId: string;
  clearSelection: () => void;
  workspaceId: string;
  page: "home" | "bin";
  listPage: number;
  moveToBin: (value: boolean) => void;
  transcriptionList: Partial<Transcription>[];
  setTranscriptions: (value: Partial<Transcription>[]) => void;
};

const MenuSelection: FC<ComProps> = ({
  selectionId,
  clearSelection,
  workspaceId,
  page,
  listPage,
  moveToBin,
  transcriptionList,
  setTranscriptions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    body: string;
    confirmButton: string;
    cancelButton: string;
  }>({
    title: "Are you sure?",
    body: "Are you sure you want to delete this transcription? This action cannot be undone. You can restore it from the bin.",
    confirmButton: "Move to bin",
    cancelButton: "Cancel",
  });
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteTranscription,
    isError,
    isSuccess,
  } = useDeleteTranscription();

  const handleModal = () => {
    if (page === "home") {
      setIsModalOpen(true);
    } else if (page === "bin") {
      setModalContent({
        title: "Are you sure?",
        body: "Are you sure you want to delete this transcription? This action cannot be undone. And you cannot restore it from the bin.",
        confirmButton: "Delete Forever",
        cancelButton: "Cancel",
      });
      setIsModalOpen(true);
    }
  };

  const invalidateQueries = () => {
    const filter = {
      field: "isDeleted",
      op: page === "home" ? "==" : "!=",
      value: false,
    };
    queryClient.invalidateQueries({
      queryKey: [
        "getQueryTranscriptions",
        { workspaceId, page: listPage, filter },
      ],
    });
  };
  const removeItemFromList = () => {
    if (
      transcriptionList.length > 0 &&
      transcriptionList.filter((item) => item.uid === selectionId).length > 0
    ) {
      const newList = transcriptionList.filter(
        (item) => item.uid !== selectionId
      );
      setTranscriptions(newList);
    }
  };

  const handleDelete = async () => {
    await deleteTranscription({ uuid: selectionId });
    clearSelection();
    invalidateQueries();
    removeItemFromList();
  };

  const handleMoveToBin = async () => {
    await moveToBin(true);
    clearSelection();
    invalidateQueries();
    removeItemFromList();
  };

  const handleRecovery = async () => {
    await moveToBin(false);
    clearSelection();
    invalidateQueries();
    removeItemFromList();
  };

  // Toast notifications
  if (isError) {
    dispatch(
      showToast({
        message: "Error during deletion, please try again!",
        type: "alert-error",
      })
    );
  }
  if (isSuccess) {
    dispatch(
      showToast({ message: "Action successful!", type: "alert-success" })
    );
  }

  return (
    <div className="bg-white shadow-md max-w-fit fixed top-20 left-80 rounded-xl flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        <p className="text-sm">1 selected</p>
        <div className="h-6 border-l border-gray-300" />
        <div
          className="flex items-center gap-2 rounded-lg cursor-pointer transition-colors p-1 hover:bg-purple-500 hover:text-white text-sm"
          onClick={clearSelection}
        >
          <MdOutlineRadioButtonUnchecked size={16} />
          <span>Clear</span>
        </div>
        {page === "home" ? (
          <>
            <div
              className="flex items-center gap-2 rounded-lg cursor-pointer transition-colors p-1 hover:bg-purple-500 hover:text-white text-sm text-red-500"
              onClick={handleModal}
            >
              <MdDeleteOutline size={16} />
              <span>Delete</span>
            </div>
          </>
        ) : (
          <>
            <div
              className="flex items-center gap-2 rounded-lg cursor-pointer transition-colors p-1 hover:bg-purple-500 hover:text-white text-sm"
              onClick={handleRecovery}
            >
              <MdRestore size={16} />
              <span>Recover</span>
            </div>
            <div
              className="flex items-center gap-2 rounded-lg cursor-pointer transition-colors p-1 hover:bg-purple-500 hover:text-white text-sm text-red-500"
              onClick={handleModal}
            >
              <MdDeleteOutline size={16} />
              <span>Delete Forever</span>
            </div>
          </>
        )}
        <CustomLocalModal
          content={modalContent}
          isOpen={isModalOpen}
          onCancelButton={() => setIsModalOpen(false)}
          onConfirmButton={page === "home" ? handleMoveToBin : handleDelete}
        />
      </div>
    </div>
  );
};

export default MenuSelection;
