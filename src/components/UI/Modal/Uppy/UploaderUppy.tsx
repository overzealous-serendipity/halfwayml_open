import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getFileDurationHandler } from "@/components/UI/Modal/Uppy/utils/getFileDuration";
import { ExtendedFile } from "@/types/extendedFile";
import styles from "./MyUploadComponent.module.css";
import { useDispatch } from "react-redux";

import { setFile, removeFile } from "@/config/redux/store/fileSlice";
import { showToast } from "@/config/redux/store/toastSlice";
import { UppyFile } from "@uppy/core";
export default function UppyUploader({}: // setFiles,
{
  // setFiles: React.Dispatch<React.SetStateAction<ExtendedFile[]>>;
}) {
  const fileKeyRef = useRef<string>("");
  const [fileQueue, setFileQueue] = useState<ExtendedFile[]>([]);
  const [ready, setReady] = useState(false);
  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_DOMAIN_BASE_URL,
    });
  }, []);
  const uppy = useMemo(() => {
    const uppyInstance = new Uppy({
      debug: true,
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["audio/*", "video/*"],
      },
    });

    uppyInstance.use(AwsS3, {
      companionUrl: "/",
      getUploadParameters: async (file) => {
        try {
          const fileUUID = uuidv4();
          const extension = file.name.split(".").pop();
          const fileKey = `tempFiles/${fileUUID}.${extension}`;
          fileKeyRef.current = fileKey;

          const response = await api.post("/api/v1/s3/s3Upload", {
            fileName: file.name,
            fileUUID,
            contentType: file.type,
          });
          
          const { uploadUrl, accessUrl } = response.data;
          console.log("Here is the uploadUrl from the UppyUploader: ", uploadUrl);
          console.log("Here is the accessUrl from the UppyUploader: ", accessUrl);
          return {
            method: "PUT",
            url: uploadUrl,
            fields: {},
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          };
        } catch (error) {
          console.error("Error getting upload parameters", error);
          throw error;
        }
      },
    });

    return uppyInstance;
  }, [api]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (fileQueue.length > 0) {
      // We need only the properties of the file object and not the file object itself
      const file: ExtendedFile = fileQueue[0];
      const fileData: Partial<ExtendedFile> = {
        name: file.name,
        type: file.type,
        size: file.size,
        duration: file.duration,
        storageFilePath: file.storageFilePath,
        downloadURL: file.downloadURL,
      };
      dispatch(setFile(fileData));
      setFileQueue([]); // Reset queue
    }
  }, [fileQueue, dispatch]); // Only update files when fileQueue changes

  const uploadSuccessHandler = useCallback(async (file?: UppyFile) => {
    const result = await getFileDurationHandler({
      fileKey: fileKeyRef.current,
      file: file?.data as ExtendedFile,
    });
    if (result) {
      setFileQueue((prev: ExtendedFile[]) => [
        ...prev,
        result.file as ExtendedFile,
      ]);
    }
  }, []);

  const fileRemovedHandler = useCallback(async () => {
    try {
      const response = await api.post("/api/v1/s3/delete", {
        fileKey: fileKeyRef.current,
      });
      dispatch(removeFile());
      return response.data;
    } catch (error) {
      dispatch(
        showToast({
          type: "alert-error",
          message: "Failed to delete file",
        })
      );
      return null;
    }
  }, [dispatch, api]);

  useEffect(() => {
    uppy.on("upload-success", uploadSuccessHandler);
    uppy.on("file-removed", fileRemovedHandler);
    setReady(true);
    return () => {
      uppy.off("upload-success", uploadSuccessHandler);
      uppy.off("file-removed", fileRemovedHandler);
    };
  }, [uppy, uploadSuccessHandler, fileRemovedHandler]);

  return (
    <div className="text-base-300">
      {ready && (
        <Dashboard
          className={styles.uppyDashboard}
          uppy={uppy}
          height={420}
          width={400}
          thumbnailHeight={50}
          thumbnailWidth={50}
          disableThumbnailGenerator={true}
          hidePauseResumeButton={true}
          proudlyDisplayPoweredByUppy={false}
          showRemoveButtonAfterComplete={true}
          hideProgressAfterFinish={true}
          hideUploadButton={true}
        />
      )}
    </div>
  );
}
