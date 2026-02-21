import { mbGet } from "./musicbrainzClient";
import {
  MBReleaseListResponse,
  MBReleaseDetailResponse,
} from "../types/musicbrainz";
import { TrackResult } from "../types/api";
import { cache } from "../utils/cache";
import { formatDuration } from "../utils/formatDuration";

export async function getTracksByReleaseGroup(
  releaseGroupMBID: string
): Promise<TrackResult[]> {
  const tracksCacheKey = `release:tracks:${releaseGroupMBID}`;
  const cachedTracks = cache.get<TrackResult[]>(tracksCacheKey);
  if (cachedTracks) return cachedTracks;

  const releaseMBID = await resolveReleaseMBID(releaseGroupMBID);

  const releaseDetail = await mbGet<MBReleaseDetailResponse>(
    `/release/${releaseMBID}`,
    { inc: "recordings" }
  );

  const tracks: TrackResult[] = [];

  for (const media of releaseDetail.media) {
    for (const track of media.tracks) {
      const durationMs = track.length ?? track.recording?.length ?? null;

      tracks.push({
        id: track.recording?.id ?? track.id,
        title: track.title,
        position: track.position,
        duration: formatDuration(durationMs),
        disc: media.position,
      });
    }
  }

  cache.set(tracksCacheKey, tracks);
  return tracks;
}

async function resolveReleaseMBID(
  releaseGroupMBID: string
): Promise<string> {
  const mapCacheKey = `releasegroup:release:${releaseGroupMBID}`;
  const cachedId = cache.get<string>(mapCacheKey);
  if (cachedId) return cachedId;

  const data = await mbGet<MBReleaseListResponse>("/release", {
    "release-group": releaseGroupMBID,
    limit: 100,
  });

  if (!data.releases || data.releases.length === 0) {
    const error = new Error(
      "No releases found for this album"
    ) as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }

  const sorted = [...data.releases].sort((a, b) => {
    const aOfficial = a.status === "Official" ? 0 : 1;
    const bOfficial = b.status === "Official" ? 0 : 1;
    if (aOfficial !== bOfficial) return aOfficial - bOfficial;

    const aDate = a.date || "9999";
    const bDate = b.date || "9999";
    return aDate.localeCompare(bDate);
  });

  const bestRelease = sorted[0];
  cache.set(mapCacheKey, bestRelease.id);
  return bestRelease.id;
}
