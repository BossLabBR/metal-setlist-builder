import { searchArtists } from "../../../src/services/artistService";
import * as musicbrainzClient from "../../../src/services/musicbrainzClient";
import { MBArtistSearchResponse } from "../../../src/types/musicbrainz";

jest.mock("../../../src/services/musicbrainzClient");

const mockMbGet = musicbrainzClient.mbGet as jest.MockedFunction<
  typeof musicbrainzClient.mbGet
>;

describe("artistService.searchArtists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should map MusicBrainz response to ArtistSearchResult[]", async () => {
    const mbResponse: MBArtistSearchResponse = {
      created: "2024-01-01",
      count: 2,
      offset: 0,
      artists: [
        {
          id: "abc-123",
          name: "Slayer",
          country: "US",
          disambiguation: "thrash metal band",
          score: 100,
        },
        {
          id: "def-456",
          name: "Slayer",
          country: "BR",
          disambiguation: "",
          score: 80,
        },
      ],
    };

    mockMbGet.mockResolvedValue(mbResponse);

    const results = await searchArtists("Slayer");

    expect(mockMbGet).toHaveBeenCalledWith("/artist", {
      query: "Slayer",
      limit: 10,
    });
    expect(results).toEqual([
      {
        id: "abc-123",
        name: "Slayer",
        country: "US",
        disambiguation: "thrash metal band",
      },
      {
        id: "def-456",
        name: "Slayer",
        country: "BR",
        disambiguation: null,
      },
    ]);
  });

  it("should limit results to 10 even if MusicBrainz returns more", async () => {
    const artists = Array.from({ length: 15 }, (_, i) => ({
      id: `id-${i}`,
      name: `Artist ${i}`,
      score: 100 - i,
    }));

    mockMbGet.mockResolvedValue({
      created: "2024-01-01",
      count: 15,
      offset: 0,
      artists,
    });

    const results = await searchArtists("test");
    expect(results).toHaveLength(10);
  });

  it("should handle optional fields (country null, disambiguation empty)", async () => {
    mockMbGet.mockResolvedValue({
      created: "2024-01-01",
      count: 1,
      offset: 0,
      artists: [
        {
          id: "abc-123",
          name: "Test Artist",
        },
      ],
    });

    const results = await searchArtists("test");

    expect(results[0]).toEqual({
      id: "abc-123",
      name: "Test Artist",
      country: null,
      disambiguation: null,
    });
  });
});
