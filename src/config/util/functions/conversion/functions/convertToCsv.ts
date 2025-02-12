import { Document as DocumentType } from "@/types/transcriptionDocument";
import { formatTime } from "./convertToSrt";


export const convertToCsv = (content: DocumentType, docTitle: string): string => {
  // Define the title and headers
  const title = `Title: ${docTitle}\n`;

  const headers = "Speaker,Start Time,End Time,Text\n";

  // Build CSV content
  const csvContent = content.utterances.reduce((acc, utterance) => {
    // Combine all texts from children and construct one line per utterance
    const textData = utterance.children.map((child) => child.text).join(" ");
    const csvLine = [

      `"${utterance.speaker.replace(/"/g, '""')}"`,
      `"${formatTime(utterance.start)}"`,
      `"${formatTime(utterance.end)}"`,
      `"${textData.replace(/"/g, '""')}"`, // Ensure to escape quotes
    ].join(",");
    return acc + csvLine + "\n";
  }, headers);

  return title + csvContent;
};
