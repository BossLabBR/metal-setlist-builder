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

export interface ApiErrorResponse {
  error: string;
}
