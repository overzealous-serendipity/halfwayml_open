interface EventLog {
  event: string;
  timestamp: Date;
}

interface subtitleStyles {
  alignment: string;
  background: string | null | undefined; //box
  backgroundColor: string | null | undefined; //box
  boldFont: false; //fontStyle
  font: string; //fontFamily
  fontColor: string | null | undefined; //fontColor
  fontSize: number; //fontSize
  italicFont: false; //fontStyle
  position: string; //position (top, bottom, center)
  positionPercentage: number; //positionPercentage (0-100)
}

interface MetaData {
  name: string;
  type: string;
  orderIdOwn: string;
  itemIdOwn: string;
  idService: string;
  language_model: string | null | undefined;
  acoustic_model: string | null | undefined;
  language_code: string | null | undefined;
  status: string;
  audio_url: string;
  text: string | null | undefined;
  duration: number | null | undefined;
  confidence: number | null | undefined;
  createdAt: Date;
  updatedAt: Date;

}

interface Meta {
  metData: MetaData;
  eventsLog: EventLog[];
  exportPreferences: Record<string, unknown>; // Use an appropriate type based on what exportPreferences is supposed to contain
}
export interface Document {
  utterances: Utterance[];
}
export interface Content {
  document: Document; // Replace 'any' with the actual type of transcriptionAssemblyDoc
  subtitleStyles?: subtitleStyles; // Use an appropriate type based on what subtitleStyles is supposed to contain
  meta: Meta;
}

export interface TranscriptionToStorage {
  content: Content;
  document: Document;
}

export interface Word {
  confidence: number;
  end: number;
  speaker: string | null | undefined;
  start: number;
  text: string;
  type: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  highlight: boolean;
  reviewed: boolean;
}
export interface Utterance {
  comments?: string[];
  confidence: number;
  end: number;
  reviewed: boolean;
  speaker: string;
  start: number;
  bodyText: string;
  fullText?: string;
  type: string;
  children: Word[];
}
