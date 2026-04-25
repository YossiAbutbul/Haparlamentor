export type TranscriptLine = {
  t: number;
  speaker?: string;
  text: string;
  part?: string;
};

export type Episode = {
  id: string;
  season: number;
  episode: number;
  title?: string;
  makoUrl: string;
  lines: TranscriptLine[];
};

export type SearchHit = {
  episode: Episode;
  lineIndex: number;
  line: TranscriptLine;
  context: { before?: TranscriptLine; after?: TranscriptLine };
  score: number;
};
