import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { hideToast } from "@/config/redux/store/toastSlice";
import { IoIosCloseCircle } from "react-icons/io";

type ComProps = {};

const ToastManager: FC<ComProps> = () => {
  const { isVisible, message, type } = useSelector((state: any) => state.toast);
  const dispatch = useDispatch();
  const [showFullMessage, setShowFullMessage] = useState(false);

  const hideToastHandler = () => {
    dispatch(hideToast());
  };

  const toggleShowFullMessage = () => {
    setShowFullMessage((prev) => !prev);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && type !== "alert-error") {
      timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000); // Toast will auto-dismiss after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [isVisible, type, dispatch]);

  const trimmedMessage =
    message.length > 50 ? message.substring(0, 50) + "..." : message;

  return (
    <>
      {isVisible && (
        <div className="toast z-50">
          <div className={`alert ${type}  flex items-start justify-between`}>
            <div className="flex-grow pr-2">
              <span>{showFullMessage ? message : trimmedMessage}</span>
              {message.length > 50 && (
                <button
                  onClick={toggleShowFullMessage}
                  className="ml-2 text-blue-500 underline"
                >
                  {showFullMessage ? "show less" : "show full"}
                </button>
              )}
            </div>
            {type !== "alert-success" && (
              <IoIosCloseCircle
                color="white"
                className="hover:cursor-pointer flex-shrink-0 ml-2"
                onClick={hideToastHandler}
                size={24}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ToastManager;
