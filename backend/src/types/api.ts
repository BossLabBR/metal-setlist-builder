export interface ArtistSearchResult {
  id: string;
  name: string;
  country: string | null;
  disambiguation: string | null;
}

export interface ApiErrorResponse {
  error: string;
}
