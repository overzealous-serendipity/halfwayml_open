

interface Glossary {
  words: string[];
}


export interface SubtitleStyleParameters {
  cpl: number;
  gap: number;
  cps: number;
  minDuration: number;
  maxDuration: number;
}

export interface SubtitlePreferences {
  subtitleStyle: number;
  parameters: SubtitleStyleParameters;
}

interface MetaData {
  createdAt?: Date;
  updatedAt?: Date;
  glossary?: Glossary;
  subtitlePreferences?: SubtitlePreferences;
}

export interface Workspace {
  name?: string;
  description?: string;
  createdBy?: string;
  collaborators?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  uuid?: string;
  uid?: string;
  metaData?: MetaData;
  organziationID?: string;
}
