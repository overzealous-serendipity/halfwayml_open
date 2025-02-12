import { ExtendedFile } from "@/types/extendedFile";
import axios from "axios";

// Check if the file is a media file based on its type
const isMediaFile = (file: ExtendedFile): boolean => {
  return file.type.includes("audio") || file.type.includes("video");
};

// Function to get the media duration using HTML5 media elements
const getMediaDuration = (file: ExtendedFile): Promise<number> => {
  return new Promise((resolve, reject) => {
    const mediaType = file.type.includes("audio") ? "audio" : "video";
    const media = document.createElement(mediaType);
    media.preload = "metadata";

    media.onloadedmetadata = () => {
      URL.revokeObjectURL(media.src); // Clean up the object URL
      if (media.duration === Infinity) {
        reject(new Error("Could not determine duration."));
      } else {
        resolve(media.duration);
      }
    };

    media.onerror = () => {
      URL.revokeObjectURL(media.src); // Clean up on error as well
      reject(new Error("Error loading media file."));
    };

    media.src = URL.createObjectURL(file);
  });
};

// Function to handle file selection and duration fetching
export const getFileDurationHandler = async ({
  file,
  fileKey,
}: {
  file: ExtendedFile;
  fileKey: string;
}): Promise<{ file: ExtendedFile; duration: number } | undefined> => {
  if (!file || !isMediaFile(file)) {
    return;
  }

  try {
    let duration = (await getMediaDuration(file).catch(async () => {
      if (!fileKey) throw new Error("File key is required");
      return await getFileDurationFromLambda(fileKey);
    })) as number;
    const fileWithMeta = Object.assign(file, {
      duration,
      storageFilePath: fileKey,
    });
    // Return file with additional metadata
    return { file: fileWithMeta, duration };
  } catch (error) {
    console.error("Error handling the file: ", error);
    throw error; // Rethrow or handle as necessary
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOMAIN_BASE_URL,
});

// Function to get the duration from a Lambda function if the client-side fetch fails
const getFileDurationFromLambda = async (fileKey: string): Promise<number> => {
  try {
    // const { data } = await api.post("/api/v1/s3/getFileDuration", {
    //   fileKey,
    // });
    const data = { duration: 0 };
    const duration = data.duration / 1000;
    return duration; // Assuming the API returns the duration directly
  } catch (error) {
    console.error("Error fetching duration from lambda: ", error);
    throw error; // Rethrow or handle as necessary
  }
};

export const formatDuration = (seconds: number, showFormat: boolean = true) => {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return "Duration not available";
  }

  // Round the seconds to the nearest integer
  // seconds = Math.round(seconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (showFormat) {
    if (hours === 0) {
      return `${minutes} min`;
    } else {
      return `${hours} hr ${minutes} min`;
    }
  } else {
    if (hours === 0) {
      return `${minutes}`;
    } else {
      return `${hours} ${minutes}`;
    }
  }
};
