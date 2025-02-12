import { Document as DocumentType } from "@/types/transcriptionDocument";
import { SubtitlePreferences } from "@/types/workspace";


type SrtEntry = {
  index: number;
  start: string;
  end: string;
  text: string;
};

export function convertToSrt(
  content: DocumentType,
  preferences: SubtitlePreferences
): string {

  let srtEntries: SrtEntry[] = [];
  let srtIndex = 1;
  let lastBlockEnd = 0;

  // Helper function to add SRT entry
  const addSrtEntry = (start: number, end: number, textLines: string[]) => {
    // Balance lines to ensure even distribution across subtitle lines
    textLines = balanceLines(textLines, preferences.subtitleStyle);
    // Adjust the start time based on the minimum gap
    start = Math.max(start, lastBlockEnd + preferences.parameters.gap);
    // Adjust the end time based on the CPS limit
    const duration = end - start;
    const cps = textLines.join(" ").length / duration;
    if (cps > preferences.parameters.cps) {
      end = start + textLines.join(" ").length / preferences.parameters.cps;
    }
    srtEntries.push({
      index: srtIndex++,
      start: formatTime(start),
      end: formatTime(end),
      text: textLines.join("\n"), // Join the lines with a newline character
    });
    lastBlockEnd = end;
  };

  // Helper function to balance lines
  const balanceLines = (lines: string[], maxLines: number): string[] => {
    let allWords = lines.join(" ").split(" ");
    let balancedLines = [];
    let wordsPerLine = Math.ceil(allWords.length / maxLines);
    for (let i = 0; i < maxLines; i++) {
      balancedLines.push(allWords.splice(0, wordsPerLine).join(" ").trim());
    }
    // Remove any empty lines that may have been created
    return balancedLines.filter((line) => line.length > 0);
  };
  const processBlock = (
    blockStart: number,
    blockEnd: number,
    currentLine: string,
    currentBlockLines: string[]
  ) => {
    if (currentLine.trim().length > 0) {
      currentBlockLines.push(currentLine.trim());
    }
    if (currentBlockLines.length > 0) {
      addSrtEntry(blockStart, blockEnd, currentBlockLines);
    }
  };

  for (const utterance of content.utterances) {
    let currentBlockLines = [];
    let currentLine = "";
    let blockStart = utterance?.start;
    let blockEnd = utterance?.start;


    for (const word of utterance?.children) {
      const wordText = word.text + " ";
      const wordLength = wordText.trim().length;

      // This is the key change: only add a new line if the next word would exceed the cpl
      if (
        currentLine.length + wordLength > preferences.parameters.cpl &&
        currentLine.length > 0
      ) {
        currentBlockLines.push(currentLine.trim());
        currentLine = wordText;
      } else {
        currentLine += wordText;
      }

      blockEnd = word.end;

      // Check if it's time to finalize this block of subtitles
      if (
        currentBlockLines.length >= preferences.subtitleStyle ||
        blockEnd - blockStart > preferences.parameters.maxDuration * 1000
      ) {
        processBlock(blockStart, blockEnd, currentLine, currentBlockLines);
        currentBlockLines = [];
        currentLine = "";
        blockStart = word.start;
      }
    }

    // Finalize the last block
    processBlock(blockStart, blockEnd, currentLine, currentBlockLines);
  }

  // Format the entries into SRT format
  return srtEntries
    .map(
      (entry) =>
        `${entry.index}\n${entry.start} --> ${entry.end}\n${entry.text}`
    )
    .join("\n\n");
}

export function formatTime(milliseconds: number): string {
  const date = new Date(milliseconds);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const ms = date.getUTCMilliseconds().toString().padStart(3, "0");
  return `${hours}:${minutes}:${seconds},${ms}`;
}
