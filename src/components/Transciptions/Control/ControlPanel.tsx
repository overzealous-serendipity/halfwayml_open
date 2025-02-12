import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaSave } from "react-icons/fa";
import { openModal } from "@/config/redux/store/modalSlice";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Transcription } from "@/types/transcription";
import { MdOutlineCloudOff } from "react-icons/md";
import { GrRedo, GrUndo } from "react-icons/gr";
import { useEditor } from "@/config/util/context/useEditorContext";
import { MdOutlineHistory } from "react-icons/md";
import { useRouter } from "next/router";
type ComProps = {
  transcriptionRecord: Transcription;
  setShowExportModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ControlPanel: FC<ComProps> = ({
  transcriptionRecord,
  setShowExportModal,
}) => {
  const { saveDocument, toastState, editor, setToastState } = useEditor();
  const dispatch = useDispatch();
  const router = useRouter();
  const handleOpenModal = () => {
    dispatch(
      openModal({
        modalType: "export",
        modalProps: {
          transcriptionRecord,
          setToastState,
        },
      })
    );
  };
  const exportHandler = () => {
    // document?.getElementById("exportModal")?.showModal();
    setShowExportModal(true);
  };
  const versionsHandler = () => {
    router.push(`/transcription/${transcriptionRecord?.id}/versions`);
  };

  const undoHandler = () => {
    // First, ensure the editor and the history object are properly checked.
    if (editor && editor.history) {
      // Check if there are any undo actions available.
      if (editor.history.undos.length === 0) {
        return;
      }
      // Perform the undo operation.
      editor.undo();
    }
  };
  const saveHandler = async () => {
    await saveDocument();
  };
  const redoHandler = () => {
    if (editor && editor.history) {
      // Check if there are any undo actions available.
      if (editor.history.redos.length === 0) {
        return;
      }
      // Perform the undo operation.
      editor.redo();
    }
  };
  const style = `hover:bg-purple-500 rounded-lg p-1 hover:text-slate-200 transition-all duration-300 ease-in-out pointer-events-auto cursor-pointer`;
  const inActiveStyle = `hover:bg-purple-500 rounded-lg p-1 hover:text-slate-200 transition-all duration-300 ease-in-out pointer-events-none cursor-not-allowed text-gray-400`;
  return (
    <div className="fixed inset-x-0 top-5 transform -translate-y-1/2 z-10">
      {
        // Show dirty state
        toastState?.type === "isDirty" && (
          <div className="fixed left-28 flex flex-row gap-1">
            <MdOutlineCloudOff color={"red"} />
            <p className="text-xs text-red-500 font-semibold">
              Changes not saved
            </p>
          </div>
        )
      }
      <div className="flex justify-center">
        <ul
          className=" fixed bg-purple-100 flex flex-row gap-2 rounded-lg p-1 pr-4 pl-4 mx-auto group-[
        hover:shadow-lg] hover:shadow-lg transition-all duration-300 ease-in-out
      ]:"
        >
          <li
            className={`${
              toastState?.type === "isDirty" ? style : inActiveStyle
            }`}
            title="Save"
          >
            <FaSave onClick={saveHandler} size={20} />
          </li>
          <li
            onClick={undoHandler}
            className={`${
              editor?.history && editor?.history?.undos?.length > 0
                ? style
                : inActiveStyle
            }`}
            title="Undo"
          >
            <GrUndo size={20} />
          </li>
          <li
            onClick={redoHandler}
            className={`${
              editor?.history && editor?.history?.redos?.length > 0
                ? style
                : inActiveStyle
            }`}
            title="Redo"
          >
            <GrRedo size={20} />
          </li>
          <li className={`${style}`} onClick={exportHandler} title="Export">
            <IoCloudDownloadOutline size={20} />
          </li>
          <li className={`${style}`} onClick={versionsHandler} title="Versions">
            <MdOutlineHistory size={20} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;
