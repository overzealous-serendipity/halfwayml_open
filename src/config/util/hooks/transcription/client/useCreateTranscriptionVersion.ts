import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TranscriptionToStorage } from "@/types/transcriptionDocument";

interface UploadUrlResponse {
  uploadURL: string;
  accessURL: string;
  fileKey: string;
}

interface FileDetails {
  workspaceId: string;
  transcriptionId: string;
  uuid: string;
  userId: string;
}

interface UploadParams {
  file: TranscriptionToStorage;
  uploadURL: string;
  fileKey: string;
}

const api = axios.create({
  baseURL: process.env.DOMAIN_BASE_URL,
});

const fetchUploadUrl = async (
  details: FileDetails
): Promise<UploadUrlResponse> => {
  const response = await api.post<UploadUrlResponse>(
    "/api/v1/s3/uploadVersion",
    details
  );
  return response.data;
};

const uploadFileToS3 = async ({
  file,
  uploadURL,
  fileKey,
}: UploadParams): Promise<void> => {
  const response = await fetch(uploadURL, {
    method: "PUT",
    body: JSON.stringify(file),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to S3");
  }
};

const updateTranscriptionRecord = async (
  fileDetails: FileDetails,
  fileKey: string
) => {
  // Using our API endpoint to update the transcription record
  const response = await api.post("/api/v1/transcription/version/create", {
    transcriptionId: fileDetails.transcriptionId,
    workspaceId: fileDetails.workspaceId,
    userId: fileDetails.userId,
    url: fileKey,
  });

  if (response.status !== 200) {
    throw new Error("Failed to update transcription record");
  }
};

export function useCreateTranscriptionVersion(fileDetails: FileDetails) {
  const getUploadUrl = useMutation({
    mutationFn: fetchUploadUrl,
  });

  const uploadFile = useMutation({
    mutationFn: uploadFileToS3,
  });

  const uploadJsonToS3 = async (file: TranscriptionToStorage) => {
    try {
      const { uploadURL, accessURL, fileKey } = await getUploadUrl.mutateAsync(
        fileDetails
      );
      console.log(
        "Here is the file: ",
        file,
        "here is the file key: ",
        fileKey,
        "here is the upload URL: ",
        uploadURL
      );
      await uploadFile.mutateAsync({ file, uploadURL, fileKey });

      await updateTranscriptionRecord(
        {
          transcriptionId: fileDetails.transcriptionId,
          userId: fileDetails.userId,
          uuid: fileDetails.uuid,
          workspaceId: fileDetails.workspaceId,
        },
        fileKey
      );
    } catch (error) {
      throw error;
    }
  };

  return {
    uploadJsonToS3,
    isFetching: getUploadUrl.isPending || uploadFile.isPending,
    error: getUploadUrl.error || uploadFile.error,
  };
}
