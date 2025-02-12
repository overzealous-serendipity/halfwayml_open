import React, { FC, useState, useEffect } from "react";
// Ensure correct import paths for your icons
import { LuFileVideo } from "react-icons/lu";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { Bars } from "react-loader-spinner";
import {
  BsCheckCircle,
  BsXCircle,
  BsClock,
  BsArrowRepeat,
} from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";

// Define types based on Prisma schema
type TranscriptionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "processing"
  | "deleted"
  | "notPayed"
  | "recovered";

type TranscriptionType = "transcription" | "subtitle" | "translation" | "caption";

interface TranscriptionProps {
  id: string;
  uuid: string;
  name: string;
  type: TranscriptionType;
  status: TranscriptionStatus;
  meta?: {
    language_code?: string;
  };
  createdAt: Date;
  workspaceId: string;
}

type ComProps = {
  type: TranscriptionType;
  transcription: Partial<TranscriptionProps>;
  onClick: () => void;
  onSelectionChange: (id: string, isChecked: boolean) => void;
  isSelected: boolean;
  pageName: "home" | "bin";
};

const Item: FC<ComProps> = ({
  type,
  transcription,
  onClick,
  isSelected,
  onSelectionChange,
  pageName,
}) => {
  const [currentStatus, setCurrentStatus] = useState<TranscriptionStatus>(
    transcription.status as TranscriptionStatus
  );
  const router = useRouter();

  useEffect(() => {
    if (transcription.id && transcription.status === "pending") {
      const pollStatus = async () => {
        try {
          const response = await axios.get(
            `/api/v1/transcription/status/${transcription.id}`
          );
          const newStatus = response.data.status;
          if (newStatus !== currentStatus) {
            setCurrentStatus(newStatus);
          }
        } catch (error) {
          console.error("Error polling transcription status:", error);
        }
      };

      const intervalId = setInterval(pollStatus, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [transcription.id, transcription.status, currentStatus]);

  const formatDate = (date: Date) => {
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    day = day.padStart(2, "0");
    month = month.padStart(2, "0");

    return `${day}.${month}.${year}`;
  };

  const itemClickHandler = () => {
    currentStatus === "completed" &&
      pageName === "home" &&
      router.push(`/transcription/${transcription.uuid}`);
  };

  const createdAtDate = transcription.createdAt
    ? formatDate(new Date(transcription.createdAt))
    : "";

  const statusStyles: {
    [key in TranscriptionStatus]: {
      icon: JSX.Element;
      color: string;
      text: string;
    };
  } = {
    completed: {
      icon: <BsCheckCircle />,
      color: "text-green-500",
      text: "Done",
    },
    pending: { icon: <BsClock />, color: "text-yellow-500", text: "Pending" },
    failed: { icon: <BsXCircle />, color: "text-red-500", text: "Failed" },
    processing: {
      icon: <BsArrowRepeat />,
      color: "text-blue-500",
      text: "Processing",
    },
    deleted: { icon: <BsXCircle />, color: "text-red-500", text: "Deleted" },
    notPayed: { icon: <BsXCircle />, color: "text-red-500", text: "Not Payed" },
    recovered: {
      icon: <BsCheckCircle />,
      color: "text-green-500",
      text: "Recovered",
    },
  };

  const renderStatus = (status: TranscriptionStatus) => {
    const { icon, color, text } = statusStyles[status];
    return (
      <td className={`px-4 py-2 text-sm ${color}`}>
        <div className="flex items-center gap-2">
          {icon}
          <span>{text}</span>
        </div>
      </td>
    );
  };

  const renderStatusIcon = () => {
    if (currentStatus === "pending") {
      return (
        <div className="avatar rounded-full border-[1px] p-1">
          <Bars height="20" width="20" />
        </div>
      );
    } else {
      return type === "caption" ? (
        <LuFileVideo size={20} />
      ) : (
        <LiaFileInvoiceSolid size={20} />
      );
    }
  };

  return (
    <tr
      className={`
      ${
        currentStatus === "completed" &&
        pageName === "home" &&
        "hover:bg-base-300 hover:bg-opacity-30 hover:cursor-pointer"
      }
      `}
    >
      <td className="px-4 py-2">
        <label>
          <input
            type="checkbox"
            className="checkbox w-4 h-4"
            onChange={(e) => {
              transcription?.id &&
                onSelectionChange(transcription.id, e.target.checked);
            }}
            checked={isSelected}
          />
        </label>
      </td>

      <td
        className="transition duration-300 px-4 py-2"
        onClick={itemClickHandler}
      >
        <div className="flex items-center gap-3">
          {renderStatusIcon()}
          <div className="max-w-xs">
            <div className="text-xs font-bold truncate">
              {transcription.name}
            </div>
            <div className="text-xs text-gray-500">{transcription.type}</div>
          </div>
        </div>
      </td>
      {renderStatus(currentStatus)}
      <td className="px-4 py-2 text-sm" onClick={itemClickHandler}>
        {transcription?.meta?.language_code}
      </td>
      <td className="px-4 py-2 text-sm" onClick={itemClickHandler}>
        {transcription?.type}
      </td>
      <td className="px-4 py-2 text-sm" onClick={itemClickHandler}>
        {createdAtDate}
      </td>
    </tr>
  );
};

export default Item;
