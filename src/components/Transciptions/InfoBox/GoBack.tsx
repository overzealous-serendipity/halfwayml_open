import React, { FC, useState, useCallback } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useEditor } from "@/config/util/context/useEditorContext";
import { useRouter } from "next/router";
import CustomLocalModal, {
  ButtonData,
} from "@/components/UI/Modal/orders/Transcribe/CustomLocalModal";

type ComProps = {};

const GoBack: FC<ComProps> = () => {
  const router = useRouter();
  const { toastState, setToastState, saveDocument } = useEditor();
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);
  const [modalContent, setModalContent] = React.useState<{
    title: string;
    body: string;
    confirmButton: string;
    cancelButton: string;
  }>({
    title: "Unsaved Changes! ⚠️",
    body: "You have unsaved changes that will be lost if you leave. Would you like to save them before going?",
    confirmButton: "Save & Leave",
    cancelButton: "Leave without saving",
  });
  const onCancelButtonModal = useCallback(() => {
    setIsLocalModalOpen(false);
  }, []);
  const onConfirmButtonModal = useCallback(async () => {
    await saveDocument();
    setIsLocalModalOpen(false);
    setTimeout(() => {
      router.push("/"), 200;
    });
  }, [saveDocument, router]);
  const onLeaveButtonModal = useCallback(() => {
    setIsLocalModalOpen(false);
    router.push("/");
  }, [router]);
  const handleGoBack = () => {
    if (toastState?.type === "isDirty") {
      // document?.getElementById("my_modal_1")?.showModal();
      setIsLocalModalOpen(true);
    } else {
      router.push("/");
    }
  };
  const buttonsModal: ButtonData[] = [
    {
      label: "Stay here",
      onClick: onCancelButtonModal,
    },
  ];
  return (
    <>
      <IoMdArrowRoundBack
        size={30}
        onClick={handleGoBack}
        className="text-4xl cursor-pointer p-1 border-[1px] rounded-lg hover:bg-purple-500 hover:text-white"
      />
      <CustomLocalModal
        buttons={buttonsModal}
        content={modalContent}
        isOpen={isLocalModalOpen}
        onCancelButton={onLeaveButtonModal}
        onConfirmButton={onConfirmButtonModal}
      />
    </>
  );
};

export default GoBack;
