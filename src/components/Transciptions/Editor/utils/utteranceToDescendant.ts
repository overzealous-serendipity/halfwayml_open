import { Utterance } from "@/types/transcriptionDocument";

export function utteranceToDescendant(utterance: Utterance) {
  if (!utterance) throw new Error("Utterance is required");

  return {
    type: "paragraph",
    speaker: utterance.speaker,
    confidence: utterance.confidence,
    end: utterance.end,
    reviewed: utterance.reviewed,
    start: utterance.start,
    bodyText: utterance.bodyText,
    comments: utterance.comments,
    children: utterance?.children?.map((word, index) => ({
      text: `${word.text}${index < utterance?.children?.length - 1 ? " " : ""}`,
      confidence: word.confidence,
      end: word.end,
      speaker: word.speaker,
      start: word.start,
      highlight: word.highlight,
      type: "text",
      bold: word.bold || false,
      italic: word.italic || false,
      underline: word.underline || false,
      reviewed: word.reviewed || false,
    })),
  };
}
