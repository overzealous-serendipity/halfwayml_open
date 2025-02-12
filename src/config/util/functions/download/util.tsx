// utils.ts
import axios from "axios";
import { Readable } from "stream";
import ytdl from "ytdl-core";
import fs from "fs";
import path from "path";
import { ExtendedFile } from "@/types/extendedFile";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOMAIN_BASE_URL,
});

export async function downloadFileFromDrive(
  driveUrl: string
): Promise<[Readable, string, string]> {
  const fileId = extractFileId(driveUrl);
  if (!fileId) throw new Error("Invalid Google Drive URL");

  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await api.get(url, { responseType: "stream" });
  const contentType = response.headers["content-type"];
  return [response.data, fileId, contentType];
}

function extractFileId(driveUrl: string): string | null {
  // Regular expressions to match different Google Drive URL formats
  const regexPatterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/, // Format: https://drive.google.com/file/d/FILE_ID
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/, // Format: https://drive.google.com/open?id=FILE_ID
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/, // Format: https://drive.google.com/uc?id=FILE_ID
  ];

  for (const pattern of regexPatterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
}

//  Download a video from YouTube and convert it to MP3
// export async function downloadVideoFromYoutubeAsMP3(
//   youtubeUrl: string,
//   onProgress: (percent: number) => void
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const stream = ytdl(youtubeUrl, {
//       quality: "highestaudio",
//     });
//     let filename = "";

//     stream.on("info", (info) => {
//       filename = `${info.videoDetails.videoId}.mp3`;
//       const outputFilePath = path.join(process.cwd(), "files", filename);

//       ffmpeg(stream)
//         .audioBitrate(128)
//         .on("error", reject)
//         .on("end", () => resolve(outputFilePath))
//         .save(outputFilePath);
//     });
//     stream.on("progress", (chunkLength, downloaded, total) => {
//       const percent = parseFloat(((downloaded / total) * 100).toFixed(2));
//       onProgress(percent);
//     });
//     stream.on("error", reject);
//   });
// }

// Download a video from YouTube
export async function downloadVideoFromYoutube(
  youtubeUrl: string,
  onProgress?: (percent: number) => void
): Promise<{ filePath: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const stream = ytdl(youtubeUrl, {
      quality: "highest",
    });
    let filename = "";

    stream.on("info", (info) => {
      filename = `${info.videoDetails.videoId}.mp4`;
      const outputFilePath = path.join(process.cwd(), "files", filename);

      stream
        .pipe(fs.createWriteStream(outputFilePath))
        .on("finish", () =>
          resolve({ filePath: outputFilePath, fileName: filename })
        )
        .on("error", reject);
    });

    // stream.on("progress", (chunkLength, downloaded, total) => {
    //   const percent = parseFloat(((downloaded / total) * 100).toFixed(2));
    //   onProgress(percent);
    // });
    stream.on("error", reject);
  });
}
// Download a video from YouTube and return the stream
export async function downloadVideoFromYoutubeAsStream(
  youtubeUrl: string,
  onProgress?: (percent: number) => void
): Promise<NodeJS.ReadableStream> {
  return new Promise((resolve, reject) => {
    const stream = ytdl(youtubeUrl, { quality: "highest" });

    stream.on("progress", (chunkLength, downloaded, total) => {
      if (onProgress) {
        const percent = parseFloat(((downloaded / total) * 100).toFixed(2));
        onProgress(percent);
      }
    });

    stream.on("error", reject);

    resolve(stream); // Resolve the promise with the stream itself
  });
}

// Get the File media Duration in seconds
const isMediaFile = (file: ExtendedFile) => {
  return file.type.includes("audio") || file.type.includes("video");
};

const getMediaDuration = (file: ExtendedFile) => {
  return new Promise((resolve, reject) => {
    const media = document.createElement(
      file.type.includes("audio") ? "audio" : "video"
    );
    media.src = URL.createObjectURL(file);

    media.onloadedmetadata = () => {
      resolve(media.duration);
      URL.revokeObjectURL(media.src);
    };

    media.onerror = () => {
      reject(new Error("Error loading media file."));
      URL.revokeObjectURL(media.src);
    };
  });
};

const handleFileChange = async (e: { target: { files: any[] } }) => {
  const file = e.target.files[0];
  if (file && isMediaFile(file)) {
    try {
      const duration = await getMediaDuration(file);
      // Implement your logic based on the duration
      if (duration) {
        // Proceed with the upload
      } else {
        // Handle file too long
      }
    } catch (error) {
      // Handle error
    }
  } else {
    // Handle non-media file or proceed with other file types
  }
};
