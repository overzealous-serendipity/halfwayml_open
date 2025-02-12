import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToast } from "@/config/redux/store/toastSlice";

interface Transcription {
  id: string;
  uuid: string;
  title: string;
  type: string;
  status: string;
  mediaURL: string;
  content: any;
  workspaceId: string;
  editorId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  lastVersionURL?: string;
  description?: string;
  serviceId?: string;
  sharingEnabled?: boolean;
  transcribeFrom?: number;
  transcribeTo?: number;
  state?: string;
  meta?: any;
}

interface Version {
  id: string;
  versionNumber: number;
  content: any;
  url: string;
  transcriptionId: string;
  createdById: string;
  createdAt: string;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export function useGetTranscriptionByID(id: string) {
  return useQuery({
    queryKey: ["transcription", id],
    queryFn: async () => {
      const response = await axios.get<Transcription>(
        `/api/transcriptions/${id}`
      );
      console.log("Here is teh transcribe, ", response.data);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useGetTranscriptionVersions(id: string) {
  return useQuery({
    queryKey: ["transcriptionVersions", id],
    queryFn: async () => {
      const response = await axios.get<Version[]>(
        `/api/transcriptions/${id}/versions`
      );
      return response.data;
    },
    enabled: !!id,
  });
}

export const useGetTranscriptions = (
  workspaceId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["transcriptions", workspaceId, page],
    queryFn: async () => {
      const response = await axios.get<{
        transcriptions: Transcription[];
        total: number;
      }>(`/api/transcriptions`, {
        params: { workspaceId, page, limit },
      });
      return response.data;
    },
    enabled: !!workspaceId,
  });
};

export const useDeleteTranscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uuid }: { uuid: string }) => {
      const response = await fetch('/api/v1/transcription/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete transcription');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch transcriptions list
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
    },
  });
};

export const useUpdateTranscription = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Transcription>;
    }) => {
      const response = await axios.patch(`/api/transcriptions/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transcription", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["transcriptions"] });
      dispatch(
        showToast({
          message: "Transcription updated successfully",
          type: "alert-success",
        })
      );
    },
    onError: (error) => {
      dispatch(
        showToast({
          message: "Failed to update transcription",
          type: "alert-error",
        })
      );
    },
  });
};

export const useCreateTranscription = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data: {
      fileKey: string;
      fileName: string;
      languageCode: string;
      fileDuration: number;
    }) => {
      const response = await axios.post("/api/v1/transcription/create", data);
      return response.data;
    },
    onSuccess: () => {
      dispatch(
        showToast({
          type: "alert-success",
          message: "Transcription started! We'll notify you when it's ready.",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["transcriptions"] });

    },
    onError: (error: any) => {
      dispatch(
        showToast({
          type: "alert-error",
          message: error.response?.data?.error || "Failed to start transcription",
        })
      );
    },
  });
};
