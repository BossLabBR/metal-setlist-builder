import { mbGet } from "./musicbrainzClient";
import { MBArtistSearchResponse } from "../types/musicbrainz";
import { ArtistSearchResult } from "../types/api";

export async function searchArtists(
  query: string
): Promise<ArtistSearchResult[]> {
  const data = await mbGet<MBArtistSearchResponse>("/artist", {
    query,
    limit: 10,
  });

  return data.artists.slice(0, 10).map((artist) => ({
    id: artist.id,
    name: artist.name,
    country: artist.country || null,
    disambiguation: artist.disambiguation || null,
  }));
}
