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
