import React, { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BiSolidCheckboxChecked } from "react-icons/bi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import UppyUploader from "@/components/UI/Modal/Uppy/UploaderUppy";
import LanguageDropdown from "@/components/UI/Dropdown/LanguageDropdown/DropdownLanguages";
import { useSelector, useDispatch } from "react-redux";
import { showToast } from "@/config/redux/store/toastSlice";

import { setFile } from "@/config/redux/store/fileSlice";
import CustomLocalModal from "./CustomLocalModal";
import { useGetTranscriptions, useCreateTranscription } from "@/config/util/hooks/transcription/client/useTranscribe";
import { FaSpinner } from "react-icons/fa";

type ComProps = {
  onClose: () => void;
};

const TranscribeModal: FC<ComProps> = ({ onClose }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [languageCode, setLanguageCode] = useState("");
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);
  const file = useSelector((state: any) => state?.file);
  const createTranscription = useCreateTranscription();

  const handleCreateTranscription = async () => {
    if (!file || !languageCode || !session?.user?.id) {
      dispatch(
        showToast({
          type: "alert-error",
          message: "Please select a file and language",
        })
      );
      return;
    }

    try {
      await createTranscription.mutateAsync({
        fileKey: file.storageFilePath,
        fileName: file.name,
        languageCode,
        fileDuration: file.duration,
      });
      
      dispatch(setFile(null));
      onClose();
    } catch (error) {
      console.error("Transcription error:", error);
    }
  };

  const handleClose = () => {
    if (file) {
      setIsLocalModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = async () => {
    if (file?.storageFilePath) {
      try {
        await fetch(`/api/v1/s3/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileKey: file.storageFilePath }),
        });
        dispatch(setFile(null));
        onClose();
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    }
  };

  return (
    <>
      <main className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Transcription</h1>
          <button onClick={handleClose} className="btn btn-ghost">
            <IoIosCloseCircleOutline size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex gap-6">
          {/* Upload Section */}
          <div className="w-1/2">
            <UppyUploader />
          </div>

          {/* Settings Section */}
          <div className="w-1/2 space-y-4">
            <LanguageDropdown setLanguageCode={setLanguageCode} />

            <div className="card border p-4">
              <div className="flex items-center gap-2 mb-2">
                <BiSolidCheckboxChecked size={20} className="text-primary" />
                <span className="badge badge-primary">AI Generated</span>
              </div>
              <h2 className="text-lg font-semibold mb-2">Transcription</h2>
              <p className="text-sm text-gray-600">
                Your file will be transcribed using our AI transcription
                service.
              </p>
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={!file || !languageCode || !session?.user?.id || createTranscription.isPending}
              onClick={handleCreateTranscription}
            >
              {createTranscription.isPending ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>Starting Transcription...</span>
                </div>
              ) : (
                "Create Transcription"
              )}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {isLocalModalOpen && (
          <CustomLocalModal
            isOpen={isLocalModalOpen}
            content={{
              title: "Cancel Transcription",
              body: "Are you sure you want to cancel? The uploaded file will be deleted.",
              confirmButton: "Yes, Cancel",
              cancelButton: "No, Keep",
            }}
            onConfirmButton={handleConfirmClose}
            onCancelButton={() => setIsLocalModalOpen(false)}
          />
        )}
      </main>
    </>
  );
};

export default TranscribeModal;
