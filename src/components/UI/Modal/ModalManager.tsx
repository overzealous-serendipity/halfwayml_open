import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal";
import { closeModal } from "@/config/redux/store/modalSlice";
import OrdersMenue from "./OrdersMenue";
import TranscriptionTitleChange from "@/components/Transciptions/Export/TranscriptionTitleChange";
import { RootState, AppDispatch } from "@/config/redux/store/store";
import TranscribeModal from "./orders/Transcribe/TranscribeModal";

const ModalManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { modalType, modalProps } = useSelector(
    (state: RootState) => state.modal
  );


  const handleClose = () => {
    dispatch(closeModal());
  };
  const handleCloseShadow = () => {
    if (modalType === "settings") {
      handleClose();
    }
  };

  // Keydown event handler
  const handleKeyDown = (event: { key: string }) => {
    if (
      event.key === "Escape" &&
      !["ProgressCheckoutModal", "transcribeFlexible", "transcribe"].includes(
        modalType as string
      )
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }); // Dependency array includes modalType to set up and clean up the listener correctly

  // Modal content mapper
  const getModalContent = (type: string | null) => {
    if (!type) return null;

    switch (type) {
      case "transcribe":
        return (
          <div className="w-[750px] h-[600px]">
            <TranscribeModal onClose={handleClose} />
          </div>
        );
      case "ordersMenue":
        return (
          <div className="w-[250px]">
            <OrdersMenue onClose={handleClose} />
          </div>
        );

      case "changeTranscriptionTitle":
        return (
          <div className="min-w-96 max-w-6xl">
            <TranscriptionTitleChange  />
          </div>
        );

      // Add other modal types and their content here
      default:
        return null;
    }
  };

  if (!modalType) return null;

  return (
    <Modal
      isOpen={!!modalType}
      content={getModalContent(modalType)}
      onClose={handleCloseShadow}
    />
  );
};

export default ModalManager;
