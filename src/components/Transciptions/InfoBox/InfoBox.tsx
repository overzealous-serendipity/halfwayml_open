import { supportedLanguages } from "@/components/UI/Dropdown/util/util";
import { IoTimeOutline } from "react-icons/io5";
import { GrLanguage } from "react-icons/gr";
import React, { FC } from "react";
import { secondsToHms } from "@/config/util/functions/format/fn";
import { useDispatch } from "react-redux";
import { openModal } from "@/config/redux/store/modalSlice";
import { Transcription } from "@/types/transcription";


type ComProps = {
  transcriptionRecord: Transcription;
};


const InfoBox: FC<ComProps> = ({ transcriptionRecord }) => {
  const dispatch = useDispatch();

  const changeTitleHandler = () => {
    const serializableRecord = {
      id: transcriptionRecord.id,
      uuid: transcriptionRecord.uuid,
      title: transcriptionRecord.title,
      workspaceId: transcriptionRecord.workspaceId,
      ownerId: transcriptionRecord.editorId,
    };
    dispatch(
      openModal({
        modalType: "changeTranscriptionTitle",
        modalProps: { transcriptionRecord: { ...serializableRecord } },
      })
    );
  };
  const style = `text-xs flex flex-row gap-2 items-center`;
  const language = supportedLanguages.find(
    (lang) => lang.value === transcriptionRecord?.meta?.language_code
  )?.label;
  const duration =
    transcriptionRecord?.meta?.duration &&
    secondsToHms(transcriptionRecord?.meta?.duration);
  // const dateTime = transcriptionRecord?.createdAt
  //   ?.toDate()
  //   .toLocaleString("de-DE", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  return (
    <div className="flex flex-col gap-6">
      <h1
        onClick={changeTitleHandler}
        className="text-2xl font-bold hover:cursor-pointer"
      >
        {transcriptionRecord?.title}
      </h1>
      <div id="info" className="flex flex-row gap-2">
        <p className={`${style}`}>
          <IoTimeOutline size={15} />
          {duration}
        </p>
        <p className={`${style}`}>
          <GrLanguage size={15} />
          {language}
        </p>
      </div>
    </div>
  );
};

export default InfoBox;
