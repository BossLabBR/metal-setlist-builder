import { getAlbumsByArtist } from "../../../src/services/albumService";
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

const ARTIST_MBID = "934e8731-4f5b-4c2e-b56e-e62e07609a22";

describe("albumService.getAlbumsByArtist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCache._store.clear();
  });

  it("should map release-groups to AlbumResult correctly", async () => {
    mockMbGet.mockResolvedValue({
      "release-groups": [
        {
          id: "rg-1",
          title: "Reign in Blood",
          "primary-type": "Album",
          "secondary-types": [],
          "first-release-date": "1986-10-07",
        },
      ],
      "release-group-offset": 0,
      "release-group-count": 1,
    });

    const albums = await getAlbumsByArtist(ARTIST_MBID);

    expect(albums).toEqual([
      {
        id: "rg-1",
        title: "Reign in Blood",
        year: 1986,
        coverUrl: "https://coverartarchive.org/release-group/rg-1/front-500",
      },
    ]);
  });

  it("should filter out release-groups with secondary-types", async () => {
    mockMbGet.mockResolvedValue({
      "release-groups": [
        {
          id: "rg-1",
          title: "Reign in Blood",
          "primary-type": "Album",
          "secondary-types": [],
          "first-release-date": "1986",
        },
        {
          id: "rg-2",
          title: "Live Undead",
          "primary-type": "Album",
          "secondary-types": ["Live"],
          "first-release-date": "1984",
        },
        {
          id: "rg-3",
          title: "Greatest Hits",
          "primary-type": "Album",
          "secondary-types": ["Compilation"],
          "first-release-date": "2002",
        },
      ],
      "release-group-offset": 0,
      "release-group-count": 3,
    });

    const albums = await getAlbumsByArtist(ARTIST_MBID);

    expect(albums).toHaveLength(1);
    expect(albums[0].title).toBe("Reign in Blood");
  });

  it("should sort by year ascending with nulls at the end", async () => {
    mockMbGet.mockResolvedValue({
      "release-groups": [
        {
          id: "rg-3",
          title: "Third",
          "primary-type": "Album",
          "first-release-date": "2000",
        },
        {
          id: "rg-1",
          title: "First",
          "primary-type": "Album",
          "first-release-date": "1986",
        },
        {
          id: "rg-4",
          title: "Unknown",
          "primary-type": "Album",
        },
        {
          id: "rg-2",
          title: "Second",
          "primary-type": "Album",
          "first-release-date": "1990",
        },
      ],
      "release-group-offset": 0,
      "release-group-count": 4,
    });

    const albums = await getAlbumsByArtist(ARTIST_MBID);

    expect(albums.map((a) => a.title)).toEqual([
      "First",
      "Second",
      "Third",
      "Unknown",
    ]);
    expect(albums[3].year).toBeNull();
  });

  it("should paginate when release-group-count > limit", async () => {
    mockMbGet
      .mockResolvedValueOnce({
        "release-groups": Array.from({ length: 100 }, (_, i) => ({
          id: `rg-${i}`,
          title: `Album ${i}`,
          "primary-type": "Album",
          "first-release-date": `${2000 + i}`,
        })),
        "release-group-offset": 0,
        "release-group-count": 150,
      })
      .mockResolvedValueOnce({
        "release-groups": Array.from({ length: 50 }, (_, i) => ({
          id: `rg-${100 + i}`,
          title: `Album ${100 + i}`,
          "primary-type": "Album",
          "first-release-date": `${2100 + i}`,
        })),
        "release-group-offset": 100,
        "release-group-count": 150,
      });

    const albums = await getAlbumsByArtist(ARTIST_MBID);

    expect(mockMbGet).toHaveBeenCalledTimes(2);
    expect(albums).toHaveLength(150);
  });

  it("should use cache on second access", async () => {
    mockMbGet.mockResolvedValue({
      "release-groups": [
        {
          id: "rg-1",
          title: "Reign in Blood",
          "primary-type": "Album",
          "first-release-date": "1986",
        },
      ],
      "release-group-offset": 0,
      "release-group-count": 1,
    });

    await getAlbumsByArtist(ARTIST_MBID);
    const albums = await getAlbumsByArtist(ARTIST_MBID);

    expect(mockMbGet).toHaveBeenCalledTimes(1);
    expect(albums).toHaveLength(1);
  });

  it("should build coverUrl correctly", async () => {
    mockMbGet.mockResolvedValue({
      "release-groups": [
        {
          id: "abc-def-123",
          title: "Test",
          "primary-type": "Album",
          "first-release-date": "2020",
        },
      ],
      "release-group-offset": 0,
      "release-group-count": 1,
    });

    const albums = await getAlbumsByArtist(ARTIST_MBID);
    expect(albums[0].coverUrl).toBe(
      "https://coverartarchive.org/release-group/abc-def-123/front-500"
    );
  });
});
