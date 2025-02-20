import React, { FC, useMemo } from "react";
import axios from "axios";
import { useEditor } from "@/config/util/context/useEditorContext";
import LocalModal from "@/components/UI/Modal/LocalModal";
import { Transcription } from "@prisma/client";

type ComProps = {
  transcriptionRecord: Transcription;
  setShowExportModal: React.Dispatch<React.SetStateAction<boolean>>;
  showExportModal: boolean;
};

const ExportModal: FC<ComProps> = ({
  transcriptionRecord,
  setShowExportModal,
  showExportModal,
}) => {
  const { setToastState } = useEditor();
  const [selectedFormat, setSelectedFormat] = React.useState<string>("");

  const workspaceId = transcriptionRecord?.workspaceId;

  // Memoize the API instance
  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_DOMAIN_BASE_URL,
      withCredentials: true,
    });
  }, []);

  const exportHandler = async () => {
    if (!selectedFormat || !workspaceId) {
      setToastState({
        type: "error",
        message: "Please select a format and ensure workspace access",
      });
      return;
    }

    try {
      

      const response = await api.post(
        "/api/v1/transcription/convert",
        {
          formatType: selectedFormat,
          fileURL: transcriptionRecord?.lastVersionURL,
          docTitle: transcriptionRecord?.title,
          workspaceId,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = `${transcriptionRecord?.title || 'exported_file'}.${selectedFormat.toLowerCase()}`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      link.parentNode?.removeChild(link);
      setShowExportModal(false);
      setToastState({
        type: "success",
        message: "File exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      setToastState({
        type: "error",
        message: "There was an error exporting the file",
      });
    }
  };

  const cancelHandler = () => {
    setShowExportModal(false);
  };

  return (
    <>
      <LocalModal isOpen={showExportModal}>
        <div
          className="flex flex-col gap-4 h-[250px] w-[250px] bg-gray-50 self-center justify-between p-4 rounded-xl"
          data-theme="light"
        >
          <div className="flex flex-col gap-0">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">Export</span>
              <span className="text-xs">Select format for export</span>
            </div>
          </div>
          <div id="body" className="flex flex-col gap-2">
            <select
              name="formatExport"
              id="formatExport"
              title="Select format"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="select select-primary w-full max-w-xs"
            >
              <option value="" disabled>
                Select format
              </option>
              <option value="Srt">Subtitles SubRip (.srt)</option>
              <option value="Vtt">Subtitles WebVTT (.vtt)</option>
              <option value="Txt">Text document (.txt)</option>
              <option value="Docx">Word (.docx)</option>
              <option value="Pdf">PDF (.pdf)</option>
              {/* <option value="JSON">JSON (.json)</option> */}
              <option value="Csv">Excel (.csv)</option>
            </select>
          </div>
          <div id="footer" className="flex flex-row gap-2">
            <div className="flex flex-row gap-4 justify-between w-full">
              <button onClick={cancelHandler} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={exportHandler}
                className="btn btn-primary"
                disabled={
                  selectedFormat === "" || 
                  !transcriptionRecord?.lastVersionURL ||
                  !workspaceId
                }
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </LocalModal>
    </>
  );
};

export default ExportModal;
