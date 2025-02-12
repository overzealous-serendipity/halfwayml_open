import React, { FC } from "react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { MdOutlineChevronRight } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineSubtitles } from "react-icons/md";
import MenuItem from "./orders/UI/Order";
import { useDispatch } from "react-redux";
import { openModal } from "@/config/redux/store/modalSlice";
type ComProps = {
  onClose: () => void;
};

const OrdersMenue: FC<ComProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const transcribeHandler = () => {
    onClose();
    dispatch(
      openModal({
        modalType: "transcribe",
        modalProps: {
          test: "test",
          boom: "boom",
        },
      })
    );
  };
  const subtitleHandler = () => {};
  return (
    <>
      <div className="flex flex-col gap-4 h-[250px] w-[250px] bg-gray-50 self-center">
        {/* Here is the Header */}
        <div className="flex flex-row justify-between">
          <h1 className="text-primary text-lg">Create</h1>
          <IoIosCloseCircle
            className="hover:cursor-pointer self-end"
            onClick={onClose}
            size={30}
          />
        </div>
        {/* Here is the Body */}
        <div id="body" className="flex flex-col gap-2">
          <MenuItem
            icon={<LiaFileInvoiceSolid color="blue" size={20} />}
            label="Transcribe"
            onClick={transcribeHandler}
          />
          <MenuItem
            icon={<MdOutlineSubtitles color="blue" size={20} />}
            label="Subtitle"
            onClick={subtitleHandler}
          />
        </div>
      </div>
    </>
  );
};

export default OrdersMenue;
