import { mbGet } from "./musicbrainzClient";
import { MBReleaseGroupSearchResponse } from "../types/musicbrainz";
import { AlbumResult } from "../types/api";
import { cache } from "../utils/cache";

const PAGE_LIMIT = 100;

export async function getAlbumsByArtist(
  artistMBID: string
): Promise<AlbumResult[]> {
  const cacheKey = `artist:albums:${artistMBID}`;
  const cached = cache.get<AlbumResult[]>(cacheKey);
  if (cached) return cached;

  const allReleaseGroups: MBReleaseGroupSearchResponse["release-groups"] = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const data = await mbGet<MBReleaseGroupSearchResponse>(
      `/release-group`,
      {
        artist: artistMBID,
        type: "album",
        limit: PAGE_LIMIT,
        offset,
      }
    );

    total = data["release-group-count"];
    allReleaseGroups.push(...data["release-groups"]);
    offset += PAGE_LIMIT;
  }

  const filtered = allReleaseGroups.filter(
    (rg) => !rg["secondary-types"] || rg["secondary-types"].length === 0
  );

  const albums: AlbumResult[] = filtered.map((rg) => {
    const dateStr = rg["first-release-date"];
    const year = dateStr ? parseInt(dateStr.substring(0, 4), 10) : null;

    return {
      id: rg.id,
      title: rg.title,
      year: year && !isNaN(year) ? year : null,
      coverUrl: `https://coverartarchive.org/release-group/${rg.id}/front-500`,
    };
  });

  albums.sort((a, b) => {
    if (a.year === null && b.year === null) return 0;
    if (a.year === null) return 1;
    if (b.year === null) return -1;
    return a.year - b.year;
  });

  cache.set(cacheKey, albums);
  return albums;
}
