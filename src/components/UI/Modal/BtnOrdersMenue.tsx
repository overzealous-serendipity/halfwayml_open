import React from "react";
import { useDispatch } from "react-redux";
import { openModal } from "@/config/redux/store/modalSlice";
import { AppDispatch } from "@/config/redux/store/store";

type ComProps = {
  subscriptionType?: string;
};

const CreateOrder: React.FC<ComProps> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenModal = () => {
    dispatch(
      openModal({
        modalType: "transcribe",
        modalProps: {},
      })
    );
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handleOpenModal}>
        Create
      </button>
    </div>
  );
};

export default CreateOrder;
