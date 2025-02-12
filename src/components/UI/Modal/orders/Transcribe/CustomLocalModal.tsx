import React from "react";

import LocalModal from "@/components/UI/Modal/LocalModal";

// Ensure to set the app element for accessibility reasons

export type CustomLocalContent = {
  title: string;
  body: string;
  confirmButton: string;
  cancelButton: string;
};

export type ButtonData = {
  label: string;
  onClick: () => void;
};

type ComProps = {
  onClose?: () => void;
  isOpen: boolean;
  content: CustomLocalContent;
  onConfirmButton: () => void;
  onCancelButton: () => void;
  buttons?: ButtonData[]; // Array of button data
};

const CustomLocalModal: React.FC<ComProps> = ({
  isOpen,
  onClose,
  content,
  onCancelButton,
  onConfirmButton,
  buttons,
}) => {
  // React Modal usage
  return (
    <LocalModal isOpen={isOpen} shouldCloseOnEsc={false}>
      <div className=" rounded-lg p-6 min-w-96 max-w-md ">
        <h2 className="text-primary text-base   "> {content?.title}</h2>
        <p className="text-base-content text-sm ">{content?.body}</p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={onCancelButton}
            className="px-4 py-2 rounded btn btn-outline  text-black"
          >
            {content?.cancelButton}
          </button>
          {buttons &&
            buttons?.length > 0 &&
            buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className="px-4 py-2 rounded btn btn-primary"
              >
                {button.label}
              </button>
            ))}
          <button
            onClick={onConfirmButton}
            className="px-4 py-2 rounded btn btn-warning"
          >
            {content?.confirmButton}
          </button>
        </div>
      </div>
    </LocalModal>
  );
};

export default CustomLocalModal;
