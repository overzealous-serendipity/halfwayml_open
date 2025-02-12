import { Document as DocumentType } from "@/types/transcriptionDocument";
import { SubtitlePreferences } from "@/types/workspace";


type VttEntry = {
  start: string;
  end: string;
  text: string;
};

export function convertToWebVtt(
  content: DocumentType,
  docTitle: string,
  preferences: SubtitlePreferences

): string {
  let vttEntries: VttEntry[] = [];
  let lastBlockEnd = 0;
  // Helper function to add WebVTT entry
  const addVttEntry = (start: number, end: number, textLines: string[]) => {
    textLines = balanceLines(textLines, preferences.subtitleStyle);
    start = Math.max(start, lastBlockEnd + preferences.parameters.gap);
    let adjustedEnd =
      start + textLines.join(" ").length / preferences.parameters.cps;
    if (adjustedEnd < end) end = adjustedEnd;

    vttEntries.push({
      start: formatTimeVtt(start),
      end: formatTimeVtt(end),
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
    return balancedLines.filter((line) => line.length > 0);
  };

  // Function to process and add a block of text to the entries
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
      addVttEntry(blockStart, blockEnd, currentBlockLines);
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

    processBlock(blockStart, blockEnd, currentLine, currentBlockLines);
  }

  let vttContent = "WEBVTT\n\n";
  vttContent += vttEntries
    .map(
      (entry, index) =>
        `${index + 1}\n${entry.start} --> ${entry.end}\n${entry.text}`
    )
    .join("\n\n");

  return vttContent;
}

export function formatTimeVtt(milliseconds: number): string {
  const date = new Date(milliseconds);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const ms = date.getUTCMilliseconds().toString().padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${ms}`;
}
