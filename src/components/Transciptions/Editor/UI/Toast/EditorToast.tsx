import React, { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
interface ToastProps {
  type: "isDirty" | "error" | "success" | null | string;
  message?: string;
  children?: React.ReactNode;
  setToastState?: any;
}

const EditorToast: React.FC<ToastProps> = ({
  type,
  message,
  children,
  setToastState,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type === "success") {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setToastState({ type: null, message: "" });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [type, setToastState]);
  const handleClose = () => {
    setIsVisible(false);
    setToastState({ type: null, message: "" });
  };
  if (!isVisible) return null;
  let bgColor = "bg-base-300";
  if (type === "error") bgColor = "bg-red-500";
  if (type === "success") bgColor = "bg-green-500";

  const Body = () => {
    switch (type) {
      case "isDirty":
        return (
          <span className="text-gray-500 text-xs">
            Press <kbd className="kbd kbd-sm">ctrl or ⌘</kbd> {" + "}
            <kbd className="kbd kbd-sm">s</kbd> to save.
          </span>
        );
      case "error":
        return (
          <span className="text-white text-xs">
            <span className="text-white">Error:</span> {message}
          </span>
        );
      case "success":
        return (
          <span className="text-white text-xs">
            <span className="text-white">Success:</span> {message}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-10">
      <div className="toast bottom-16">
        <div className={`alert alert-info ${bgColor} border-gray-500 p-3`}>
          {Body()}
          {type === "error" && (
            <IoIosCloseCircle
              className="text-white hover:cursor-pointer"
              onClick={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorToast;
