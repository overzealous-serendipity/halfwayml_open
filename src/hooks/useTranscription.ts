import { useQuery } from "@tanstack/react-query";

interface Transcription {
  id: string;
  uuid: string;
  title: string;
  type: string;
  status: string;
  mediaURL: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}
export function useTranscriptions(
  workspaceId: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: ["transcriptions", workspaceId, page],
    queryFn: async () => {
      const response = await fetch(`/api/transcriptions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId,
          page,
          limit,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!workspaceId,
  });
}

export function useTranscription(id: string) {
  return useQuery({
    queryKey: ["transcription", id],
    queryFn: async () => {
      const response = await fetch(`/api/transcription/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useTranscriptionMedia(mediaURL: string | undefined) {
  return useQuery({
    queryKey: ["transcriptionMedia", mediaURL],
    queryFn: async () => {
      if (!mediaURL) throw new Error("No media URL provided");

      const response = await fetch(
        `/api/media/${encodeURIComponent(mediaURL)}?path=${encodeURIComponent(
          mediaURL
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch media");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
    enabled: !!mediaURL,
  });
}
