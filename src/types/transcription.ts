export interface Meta {
  isPartiallyTranscribed?: boolean;
  isTranslation?: boolean;
  isSubtitle?: boolean;


  type?: string;
  language_model?: string | null | undefined;
  acoustic_model?: string | null | undefined;
  language_code?: string | null | undefined;
  status?: string;
  audio_url?: string;
  text?: string | null | undefined;
  duration?: number | null | undefined;
  confidence?: number | null | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Version {
  url: string;
  createdAt: {
    toDate: () => Date;  // Firebase Timestamp compatible
  };
  editedBy: string; // User ID
}
interface Links {
  self: string;
  edit: string;
  versions: string;
  media: string;
}

export type TranscriptionStatus =
  | "pending"
  | "editing"
  | "completed"
  | "deleted"
  | "failed"
  | "recoverd"
  | "notPayed";
export interface Transcription {
  id: string;
  name: string; // Name of the transcription
  type: string; // 'transcription' or 'subtitle' or 'translation'
  description?: string;
  uid: string;
  orderIdOwn?: string; // Order ID
  workspaceId?: string; // Workspace ID
  title?: string;
  lastVersionURL?: string; // URL to the latest version of the transcription
  editorId?: string; // User ID
  orderId?: string; // Order ID
  idService?: string; // ID from AssemblyAI
  editedBy?: string; // User ID
  meta?: Meta;
  status?: TranscriptionStatus; // e.g., 'completed', 'editing'
  isDeleted?: boolean;
  createdAt: {
    toDate: () => Date;  // Firebase Timestamp compatible
  };
  updatedAt: {
    toDate: () => Date;  // Firebase Timestamp compatible
  };
  uuid?: string;
  mediaURL?: string; // URL to the media file in storage
  sharingEnabled?: boolean;
  transcribeFromS?: number;
  transcribeToS?: number;

  state?: string; // e.g., 'transcribing', 'editing'
  versions: Version[];
  links?: Links;
}
export interface updateTranscriptionInout {
  ownerId: string;
  idService: string;
  lastVersionURL: string;
  orderIdOwn: string;
  sharingEnabled: boolean;
  state: string;
  status: string;
  type: string;
  workspaceIdOwn: string;
  acousticModel: string;
  duration: number | null | undefined;
  languageCode: string | null | undefined;
  languageModel: string;
}
