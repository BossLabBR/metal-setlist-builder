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

export interface MBReleaseGroup {
  id: string;
  title: string;
  "primary-type"?: string;
  "secondary-types"?: string[];
  "first-release-date"?: string;
}

export interface MBReleaseGroupSearchResponse {
  "release-groups": MBReleaseGroup[];
  "release-group-offset": number;
  "release-group-count": number;
}

export interface MBRelease {
  id: string;
  title: string;
  status?: string;
  date?: string;
  country?: string;
}

export interface MBReleaseListResponse {
  releases: MBRelease[];
  "release-offset": number;
  "release-count": number;
}

export interface MBTrack {
  id: string;
  title: string;
  position: number;
  length?: number | null;
  recording: {
    id: string;
    title: string;
    length?: number | null;
  };
}

export interface MBMedia {
  position: number;
  format?: string;
  "track-count": number;
  tracks: MBTrack[];
}

export interface MBReleaseDetailResponse {
  id: string;
  title: string;
  status?: string;
  date?: string;
  media: MBMedia[];
}
