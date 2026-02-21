export interface MBArtist {
  id: string;
  name: string;
  country?: string;
  disambiguation?: string;
  score?: number;
}

export interface MBArtistSearchResponse {
  created: string;
  count: number;
  offset: number;
  artists: MBArtist[];
}
