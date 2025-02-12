export interface Version {
  versionNumber: number;
  content: string; // Version content - transcription or caption text
  createdAt: Date;
  createdBy: string; // User ID
  uuid: string;
}

