// functions/convertToTxt.ts
import { Document as DocumentType } from "@/types/transcriptionDocument";


export const convertToTxt = (content: DocumentType): string => {
  return content.utterances
    .map((utterance) => utterance.children.map((word) => word.text).join(" "))
    .join("\n");
};

