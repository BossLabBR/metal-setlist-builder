import { getTracksByReleaseGroup } from "../../../src/services/trackService";
import * as musicbrainzClient from "../../../src/services/musicbrainzClient";
import { cache } from "../../../src/utils/cache";

jest.mock("../../../src/services/musicbrainzClient");
jest.mock("../../../src/utils/cache", () => {
  const store = new Map<string, unknown>();
  return {
    cache: {
      get: jest.fn((key: string) => store.get(key) ?? null),
      set: jest.fn((key: string, data: unknown) => store.set(key, data)),
      clear: jest.fn(() => store.clear()),
      _store: store,
    },
  };
});

const mockMbGet = musicbrainzClient.mbGet as jest.MockedFunction<
  typeof musicbrainzClient.mbGet
>;
const mockCache = cache as jest.Mocked<typeof cache> & { _store: Map<string, unknown> };

const RG_MBID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
const RELEASE_MBID = "11111111-2222-3333-4444-555555555555";

describe("trackService.getTracksByReleaseGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCache._store.clear();
  });

  it("should complete the chain: resolve release, then fetch tracks", async () => {
    mockMbGet
      .mockResolvedValueOnce({
        releases: [
          { id: RELEASE_MBID, title: "Reign in Blood", status: "Official", date: "1986-10-07" },
        ],
        "release-offset": 0,
        "release-count": 1,
      })
      .mockResolvedValueOnce({
        id: RELEASE_MBID,
        title: "Reign in Blood",
        media: [
          {
            position: 1,
            "track-count": 2,
            tracks: [
              {
                id: "t1",
                title: "Angel of Death",
                position: 1,
                length: 294000,
                recording: { id: "r1", title: "Angel of Death", length: 294000 },
              },
              {
                id: "t2",
                title: "Piece by Piece",
                position: 2,
                length: 121000,
                recording: { id: "r2", title: "Piece by Piece", length: 121000 },
              },
            ],
          },
        ],
      });

    const tracks = await getTracksByReleaseGroup(RG_MBID);

    expect(mockMbGet).toHaveBeenCalledTimes(2);
    expect(tracks).toEqual([
      { id: "r1", title: "Angel of Death", position: 1, duration: "4:54", disc: 1 },
      { id: "r2", title: "Piece by Piece", position: 2, duration: "2:01", disc: 1 },
    ]);
  });

  it("should prefer Official release over others", async () => {
    mockMbGet
      .mockResolvedValueOnce({
        releases: [
          { id: "promo-id", title: "Album (Promo)", status: "Promotion", date: "1986-01-01" },
          { id: RELEASE_MBID, title: "Album", status: "Official", date: "1986-10-07" },
        ],
        "release-offset": 0,
        "release-count": 2,
      })
      .mockResolvedValueOnce({
        id: RELEASE_MBID,
        title: "Album",
        media: [{ position: 1, "track-count": 0, tracks: [] }],
      });

    await getTracksByReleaseGroup(RG_MBID);

    expect(mockMbGet).toHaveBeenNthCalledWith(2, `/release/${RELEASE_MBID}`, {
      inc: "recordings",
    });
  });

  it("should flatten multiple media (multi-disc)", async () => {
    mockMbGet
      .mockResolvedValueOnce({
        releases: [
          { id: RELEASE_MBID, title: "Multi-disc Album", status: "Official", date: "2000" },
        ],
        "release-offset": 0,
        "release-count": 1,
      })
      .mockResolvedValueOnce({
        id: RELEASE_MBID,
        title: "Multi-disc Album",
        media: [
          {
            position: 1,
            "track-count": 1,
            tracks: [
              {
                id: "t1",
                title: "Disc 1 Track 1",
                position: 1,
                length: 180000,
                recording: { id: "r1", title: "Disc 1 Track 1", length: 180000 },
              },
            ],
          },
          {
            position: 2,
            "track-count": 1,
            tracks: [
              {
                id: "t2",
                title: "Disc 2 Track 1",
                position: 1,
                length: 200000,
                recording: { id: "r2", title: "Disc 2 Track 1", length: 200000 },
              },
            ],
          },
        ],
      });

    const tracks = await getTracksByReleaseGroup(RG_MBID);

    expect(tracks).toHaveLength(2);
    expect(tracks[0].disc).toBe(1);
    expect(tracks[1].disc).toBe(2);
  });

  it("should return null duration for tracks without length", async () => {
    mockMbGet
      .mockResolvedValueOnce({
        releases: [
          { id: RELEASE_MBID, title: "Album", status: "Official", date: "2000" },
        ],
        "release-offset": 0,
        "release-count": 1,
      })
      .mockResolvedValueOnce({
        id: RELEASE_MBID,
        title: "Album",
        media: [
          {
            position: 1,
            "track-count": 1,
            tracks: [
              {
                id: "t1",
                title: "Unknown Duration",
                position: 1,
                length: null,
                recording: { id: "r1", title: "Unknown Duration", length: null },
              },
            ],
          },
        ],
      });

    const tracks = await getTracksByReleaseGroup(RG_MBID);
    expect(tracks[0].duration).toBeNull();
  });

  it("should throw 404 when no releases found", async () => {
    mockMbGet.mockResolvedValueOnce({
      releases: [],
      "release-offset": 0,
      "release-count": 0,
    });

    await expect(getTracksByReleaseGroup(RG_MBID)).rejects.toMatchObject({
      message: "No releases found for this album",
      statusCode: 404,
    });
  });

  it("should use cache for tracks on second access", async () => {
    mockMbGet
      .mockResolvedValueOnce({
        releases: [
          { id: RELEASE_MBID, title: "Album", status: "Official", date: "2000" },
        ],
        "release-offset": 0,
        "release-count": 1,
      })
      .mockResolvedValueOnce({
        id: RELEASE_MBID,
        title: "Album",
        media: [
          {
            position: 1,
            "track-count": 1,
            tracks: [
              {
                id: "t1",
                title: "Track 1",
                position: 1,
                length: 180000,
                recording: { id: "r1", title: "Track 1", length: 180000 },
              },
            ],
          },
        ],
      });

    await getTracksByReleaseGroup(RG_MBID);
    const tracks = await getTracksByReleaseGroup(RG_MBID);

    expect(mockMbGet).toHaveBeenCalledTimes(2);
    expect(tracks).toHaveLength(1);
  });
});
