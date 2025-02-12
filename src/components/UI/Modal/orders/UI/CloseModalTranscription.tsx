import React, { FC, useCallback, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CustomLocalModal from "../Transcribe/CustomLocalModal";
import { closeModal } from "@/config/redux/store/modalSlice";
import { setFile } from "@/config/redux/store/fileSlice";
import { showToast } from "@/config/redux/store/toastSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ExtendedFile } from "@/types/extendedFile";

type ComProps = {
  file: ExtendedFile;
};

const CloseModalTranscription: FC<ComProps> = ({ file }) => {
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);

  const dispatch = useDispatch();

  // Moved modalContent to a constant outside the component as it's not changing
  const modalContent = {
    title: "Confirm cancel order 😱",
    body: "Are you sure you want to cancel this order?",
    confirmButton: "Delete order",
    cancelButton: "Cancel",
  };

  const onCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const closeHandler = useCallback(() => {
    file ? setIsLocalModalOpen(true) : onCloseModal();
  }, [file, onCloseModal]);

  const modalCancelButtonHandler = useCallback(() => {
    setIsLocalModalOpen(false);
  }, []);

  const modalConfirmHandler = useCallback(async () => {
    if (file?.storageFilePath) {
      try {
        await axios.delete(`api/v1/s3/delete`, {
          data: { fileKey: file.storageFilePath },
        });
        dispatch(setFile(null));
        dispatch(
          showToast({
            message: "Order has been deleted successfully!",
            type: "alert-success",
          })
        );
        dispatch(closeModal());
      } catch (error) {
        const e = error as Error;
        dispatch(
          showToast({
            message: "Failed to delete file" + e.message,
            type: "alert-error",
          })
        );
      }
    } else {
      dispatch(setFile(null));
      dispatch(closeModal());
    }
  }, [file?.storageFilePath, dispatch]);

  return (
    <>
      <IoMdClose
        className="hover:cursor-pointer"
        onClick={closeHandler}
        size={30}
      />
      <CustomLocalModal
        content={modalContent}
        isOpen={isLocalModalOpen}
        onClose={onCloseModal}
        onConfirmButton={modalConfirmHandler}
        onCancelButton={modalCancelButtonHandler}
      />
    </>
  );
};

export default CloseModalTranscription;
