import { convertToSrt } from "./functions/convertToSrt";
import { convertToTxt } from "./functions/convertToText";
import { convertToWebVtt } from "./functions/convertToWebVTT";
import { convertToDocx } from "./functions/convertToDocx";
import { Content, Document as DocumentType } from "@/types/transcriptionDocument";
import { convertToPDF } from "./functions/convertToPDF";
import { convertToCsv } from "./functions/convertToCsv";
import { SubtitlePreferences } from "@/types/workspace";


// Define supported format types
export type FormatType = "srt" | "txt" | "vtt" | "docx" | "pdf" | "csv";

// Default subtitle preferences
const defaultSubtitlePreferences: SubtitlePreferences = {
  subtitleStyle: 2,
  parameters: {
    cpl: 42, // characters per line
    cps: 21, // characters per second
    gap: 0.2, // minimum gap between subtitles in seconds
    minDuration: 1.0, // minimum duration in seconds
    maxDuration: 7.0, // maximum duration in seconds
  },
};

export class ConversionService {
  static convertToSrt(
    content: DocumentType,
    preferences: SubtitlePreferences = defaultSubtitlePreferences
  ): string {
    return convertToSrt(content, preferences);

  }
  
  static convertToTxt(content: DocumentType): string {
    return convertToTxt(content);
  }


  static convertToWebVtt(
    content: DocumentType,
    docTitle: string,
    preferences: SubtitlePreferences = defaultSubtitlePreferences
  ): string {
    return convertToWebVtt(content, docTitle, preferences);
  }


  static convertToDocx(content: DocumentType, docTitle: string): Promise<Blob> {
    return convertToDocx(content, docTitle);
  }


  static convertToPDF(content: DocumentType, docTitle: string): Promise<Blob> {
    return convertToPDF(content, docTitle);
  }

  static convertToCsv(content: DocumentType, docTitle: string): string {
    return convertToCsv(content, docTitle);
  }


  private static formatMethodMapping: {
    [key in FormatType]: (...args: any[]) => string | Promise<Blob>
  } = {
    srt: this.convertToSrt,
    txt: this.convertToTxt,
    vtt: this.convertToWebVtt,
    docx: this.convertToDocx,
    pdf: this.convertToPDF,
    csv: this.convertToCsv,
  };

    static async convert(
    content: DocumentType,
    formatType: string,
    docTitle: string,
    preferences?: SubtitlePreferences

  ): Promise<Blob | string> {
    // Normalize format type to lowercase
    const normalizedFormat = formatType.toLowerCase() as FormatType;
    
    // Get the conversion method
    const conversionMethod = this.formatMethodMapping[normalizedFormat];
    
    if (!conversionMethod) {
      throw new Error(`Unsupported format type: ${formatType}`);
    }

    try {
      // Handle different method signatures based on format type
      switch (normalizedFormat) {
        case 'srt':
          return (conversionMethod as typeof this.convertToSrt)(
            content,
            preferences || defaultSubtitlePreferences
          );
        case 'txt':
          return (conversionMethod as typeof this.convertToTxt)(content);
        case 'vtt':
          return (conversionMethod as typeof this.convertToWebVtt)(
            content,
            docTitle,
            preferences || defaultSubtitlePreferences
          );
        case 'docx':
        case 'pdf':
        case 'csv':
          return (conversionMethod as typeof this.convertToDocx)(content, docTitle);
        default:
          throw new Error(`Unhandled format type: ${formatType}`);
      }
    } catch (error) {
      console.error(`Error converting to ${formatType}:`, error);
      throw error;
    }
  }
}
