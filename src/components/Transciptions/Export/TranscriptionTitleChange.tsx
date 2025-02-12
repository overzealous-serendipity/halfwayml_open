import React, { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "@/config/redux/store/modalSlice";
import { Transcription } from "@/types/transcription";
import { IoClose } from "react-icons/io5";
import { useUpdateTranscription } from "@/config/util/hooks/transcription/client/useTranscribe";
type ComProps = {};

interface ReduxState {
  modal: {
    modalProps: { transcriptionRecord: Transcription };
  };
}
const TranscriptionTitleChange: FC<ComProps> = (props) => {
  const dispatch = useDispatch();
  const transcriptionRecord = useSelector(
    (state: ReduxState) => state.modal.modalProps.transcriptionRecord
  );

  const [title, setTitle] = useState(transcriptionRecord?.title);

  const [isChanged, setIsChanged] = useState(false);
  const updateTranscriptionMutation = useUpdateTranscription();

  const closeHandler = () => {
    dispatch(closeModal());
  };
  const handleTitleChange = async () => {
    try {
      if (!transcriptionRecord?.id) {
        throw new Error("Transcription Record not found");
      }

      await updateTranscriptionMutation.mutateAsync({
        id: transcriptionRecord.id,
        data: {
          title,
        },
      });
      closeHandler();
    } catch (error) {
      console.error("Error updating transcription title:", error);
    }
  };
  return (
    <>
      <div className="w-96 h-64 flex flex-col justify-between">
        <div className="p-6 flex flex-col justify-between gap-5">
          <div className=" flex flex-col  justify-between gap-5">
            <div className=" flex flex-col gap-1">
              <div className="flex justify-between">
                <h1 className="text-lg font-bold">Change Title</h1>
                <IoClose
                  className="hover:cursor-pointer"
                  size={20}
                  onClick={closeHandler}
                />
              </div>
              <p className="text-xs">
                Change the title of the transcription to make it more
                descriptive
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="ml-1 text-sm font-bold">
                Title
              </label>

              <div className="flex flex-col justify-between gap-5">
                <input
                  value={title} // Bind the input value to the title state
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  className="input input-primary"
                  id="title"
                  placeholder="Enter new title"
                />
                <button
                  disabled={
                    title === "" || title === transcriptionRecord?.title
                  }
                  onClick={handleTitleChange}
                  className="btn btn-primary w-fit"
                >
                  <span>Change Title</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranscriptionTitleChange;
