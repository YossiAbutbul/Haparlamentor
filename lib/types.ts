export type TranscriptLine = {
  t: number;
  speaker?: string;
  text: string;
};

export type Short = {
  vcmId: string;
  title: string;
  url: string;
  duration: string;
  season: number;
  lines: TranscriptLine[];
};

export type Season = {
  season: number;
  shorts: Short[];
};

export type Database = {
  seasons: Season[];
};

export type SearchHit = {
  short: Short;
  lineIndex: number;
  line: TranscriptLine;
  context: { before?: TranscriptLine; after?: TranscriptLine };
  score: number;
};
