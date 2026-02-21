export interface ArtistSearchResult {
  id: string;
  name: string;
  country: string | null;
  disambiguation: string | null;
}

export interface AlbumResult {
  id: string;
  title: string;
  year: number | null;
  coverUrl: string;
}

export interface TrackResult {
  id: string;
  title: string;
  position: number;
  duration: string | null;
  disc: number;
}

export interface ApiErrorResponse {
  error: string;
}
