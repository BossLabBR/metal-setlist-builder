import request from "supertest";
import { createApp } from "../../src/app";
import * as musicbrainzClient from "../../src/services/musicbrainzClient";

jest.mock("../../src/services/musicbrainzClient");

const mockMbGet = musicbrainzClient.mbGet as jest.MockedFunction<
  typeof musicbrainzClient.mbGet
>;

const app = createApp();

describe("GET /api/artists/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 with an array of artists", async () => {
    mockMbGet.mockResolvedValue({
      created: "2024-01-01",
      count: 1,
      offset: 0,
      artists: [
        {
          id: "934e8731-4f5b-4c2e-b56e-e62e07609a22",
          name: "Slayer",
          country: "US",
          disambiguation: "American thrash metal band",
          score: 100,
        },
      ],
    });

    const res = await request(app).get("/api/artists/search?q=Slayer");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "934e8731-4f5b-4c2e-b56e-e62e07609a22",
        name: "Slayer",
        country: "US",
        disambiguation: "American thrash metal band",
      },
    ]);
  });

  it("should return 400 when q is missing", async () => {
    const res = await request(app).get("/api/artists/search");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Query parameter 'q' is required" });
  });

  it("should return 400 when q is empty", async () => {
    const res = await request(app).get("/api/artists/search?q=");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Query parameter 'q' is required" });
  });

  it("should return 502 when MusicBrainz is unavailable", async () => {
    const axiosError = new Error("Network Error") as Error & {
      isAxiosError: boolean;
      response?: { status: number };
    };
    axiosError.isAxiosError = true;

    mockMbGet.mockRejectedValue(axiosError);

    const res = await request(app).get("/api/artists/search?q=Slayer");
    expect(res.status).toBe(502);
    expect(res.body).toEqual({
      error: "MusicBrainz temporarily unavailable",
    });
  });
});
