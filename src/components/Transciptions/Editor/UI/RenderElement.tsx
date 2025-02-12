import React, { useCallback, memo } from "react";
import { Transforms, Descendant } from "slate";
import { convertMillisecondsToTime } from "@/config/util/functions/format/fn";
import { Utterance } from "@/types/transcriptionDocument";
import { AiFillLike } from "react-icons/ai";
import { CiCircleCheck } from "react-icons/ci";
import { FaCircleCheck } from "react-icons/fa6";
import { CustomElement } from "../EditorLight";

interface RenderElementProps {
  attributes: any;
  children: any;
  element: any;
  openModal: (index: number) => void;
  initialValueState: CustomElement[];
  editor: any;
  currentTimeStamp: number;
  handleReviewChange: (utteranceIndex: number, reviewState: boolean) => void;
}

const RenderElement: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
  openModal,
  initialValueState,
  editor,
  handleReviewChange,
  currentTimeStamp,
}) => {
  const handleOpenModal = useCallback(() => {
    // const index = initialValueState.indexOf(element);
    // openModal(index);
    const index = initialValueState.findIndex(
      (el) =>
        el.type === element.type &&
        el.speaker === element.speaker &&
        el.start === element.start &&
        el.end === element.end &&
        el.confidence === element.confidence
    );
    openModal(index);
  }, [initialValueState, element, openModal]);
  const isActive =
    currentTimeStamp >= element.start / 1000 &&
    currentTimeStamp <= element.end / 1000;

  const reviewHandler = useCallback(
    (reviewState: boolean) => {
      const utteranceIndex = initialValueState.findIndex(
        (el) =>
          el.type === element.type &&
          el.speaker === element.speaker &&
          el.start === element.start &&
          el.end === element.end &&
          el.confidence === element.confidence
      );
      const newUtterance = { ...initialValueState[utteranceIndex] };
      newUtterance.reviewed = reviewState;
      Transforms.setNodes(
        editor,
        { ...newUtterance },
        { at: [utteranceIndex] }
      );
      handleReviewChange(utteranceIndex, reviewState);
    },

    [initialValueState, editor, handleReviewChange, element]
  );
  switch (element.type) {
    case "paragraph":
      const startTime = convertMillisecondsToTime(element.start);
      const endTime = convertMillisecondsToTime(element.end);
      return (
        <div
          {...attributes}
          className="flex flex-row justify-between items-start rounded-lg p-2 mt-2"
        >
          <div className="flex flex-row gap-2 min-h-full border-r mr-2">
            <div className="min-w-[200px] w-[200px] flex mt-8">
              <button
                onClick={handleOpenModal}
                className="text-sm font-medium w-[200px] h-[40px] rounded-lg p-2 hover:bg-slate-200 text-right mr-2"
              >
                {element.speaker}
              </button>
            </div>
            <div>
              <div contentEditable={false} className="mt-2">
                <p
                  contentEditable={false}
                  className="text-sm font-thin text-gray-500"
                >
                  {startTime}
                </p>
              </div>
              <p
                className={`font-sans rounded-lg p-2 body w-[700px] ${
                  isActive
                    ? "rounded-2xl border-purple-500 border-[1px] shadow-md border-opacity-50 "
                    : ""
                }`}
              >
                {children}
              </p>
            </div>
          </div>
          <div className="self-end">
            {element.reviewed === false ? (
              <CiCircleCheck
                className="text-gray-200 hover:text-purple-500 cursor-pointer"
                size={30}
                onClick={() => reviewHandler(true)}
              />
            ) : (
              <FaCircleCheck
                className="text-purple-500 hover:text-purple-500 cursor-pointer"
                size={30}
                onClick={() => reviewHandler(false)}
              />
            )}
          </div>
        </div>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default RenderElement;
