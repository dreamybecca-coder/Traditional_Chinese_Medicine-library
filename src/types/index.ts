export interface NoteSection {
  title: string;
  body: string;
}

export interface Medicine {
  id: string;
  name: string;
  category?: string;
  functions?: string;
  ingredients?: string;
  indications?: string;
  dosage?: string;
  precautions?: string;
  applicable?: string;
  notes?: string;
  tags?: string[];
  noteSections?: NoteSection[];
}

export interface Herb {
  name: string;
  dose?: string;
  source?: string;
  intent?: string;
}

export interface Visit {
  name: string;
  herbs: Herb[];
  analysis: string[];
}

export interface RelatedLink {
  id: string | null;
  title: string;
}

export interface MedCase {
  id: string;
  patient?: string;
  chiefComplaint?: string;
  syndrome?: string;
  formula?: string;
  effect?: string;
  reflection?: string;
  tags?: string[];
  noteSections?: NoteSection[];
  /* —— 富结构医案（content/ Markdown 解析而来） —— */
  no?: number;
  title?: string;
  method?: string;
  history?: string[];
  visits?: Visit[];
  turningPoint?: string;
  teachingPoints?: string[];
  safetyNotes?: string[];
  pending?: string[];
  related?: RelatedLink[];
  hasSafety?: boolean;
}

export interface Protocol {
  id: string;
  name?: string;
  target?: string;
  schedule?: string;
  duration?: string;
  effect?: string;
  notes?: string;
  tags?: string[];
  noteSections?: NoteSection[];
}

export interface TongueTip {
  id: string;
  sign: string;
  location?: string;
  meaning?: string;
  diagnosis?: string;
  relatedCases?: string;
  relatedMeds?: string;
  tags?: string[];
}

export interface Acupoint {
  id: string;
  name: string;
  location?: string;
  method?: string;
  func?: string;
  indications?: string;
  relatedCases?: string;
  relatedMeds?: string;
  notes?: string;
  tags?: string[];
  noteSections?: NoteSection[];
}

export interface TcmData {
  medicines: Medicine[];
  cases: MedCase[];
  protocols: Protocol[];
  tongue: TongueTip[];
  acupoints: Acupoint[];
}

export type DetailRef =
  | { type: 'medicine'; id: string }
  | { type: 'case'; id: string }
  | { type: 'protocol'; id: string }
  | { type: 'tongue'; id: string }
  | { type: 'acupoint'; id: string };
