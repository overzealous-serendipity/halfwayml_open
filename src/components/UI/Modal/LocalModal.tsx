import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

type ComProps = {
  isOpen: boolean;

  children: React.ReactNode;
  shouldCloseOnEsc?: boolean;
};

const LocalModal: React.FC<ComProps> = ({
  isOpen,

  children,
  shouldCloseOnEsc = true,
}) => (
  <Modal
    isOpen={isOpen}
    contentLabel="Modal"
    shouldCloseOnEsc={shouldCloseOnEsc}
    style={{
      overlay: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,

        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      content: {
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        background: "white",
        border: "2px solid gray ",
        borderRadius: "8px",
        outline: "none",
        padding: "0",
        overflow: "auto",
        boxShadow: "none",
      },
    }}
  >
    {children}
  </Modal>
);

export default LocalModal;
