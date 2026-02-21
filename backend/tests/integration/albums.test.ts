import request from "supertest";
import { createApp } from "../../src/app";
import * as musicbrainzClient from "../../src/services/musicbrainzClient";
import { cache } from "../../src/utils/cache";

jest.mock("../../src/services/musicbrainzClient");

const mockMbGet = musicbrainzClient.mbGet as jest.MockedFunction<
  typeof musicbrainzClient.mbGet
>;

const app = createApp();
const VALID_UUID = "934e8731-4f5b-4c2e-b56e-e62e07609a22";

describe("GET /api/artists/:id/albums", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it("should return 200 with an array of albums sorted by year", async () => {
    mockMbGet.mockResolvedValue({
      "release-groups": [
        {
          id: "rg-2",
          title: "South of Heaven",
          "primary-type": "Album",
          "secondary-types": [],
          "first-release-date": "1988-07-05",
        },
        {
          id: "rg-1",
          title: "Reign in Blood",
          "primary-type": "Album",
          "secondary-types": [],
          "first-release-date": "1986-10-07",
        },
      ],
      "release-group-offset": 0,
      "release-group-count": 2,
    });

    const res = await request(app).get(
      `/api/artists/${VALID_UUID}/albums`
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe("Reign in Blood");
    expect(res.body[0].year).toBe(1986);
    expect(res.body[1].title).toBe("South of Heaven");
    expect(res.body[1].year).toBe(1988);
  });

  it("should return 400 for invalid ID", async () => {
    const res = await request(app).get("/api/artists/invalid-id/albums");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid ID format" });
  });

  it("should return 502 when MusicBrainz is unavailable", async () => {
    const axiosError = new Error("Network Error") as Error & {
      isAxiosError: boolean;
    };
    axiosError.isAxiosError = true;

    mockMbGet.mockRejectedValue(axiosError);

    const res = await request(app).get(
      `/api/artists/${VALID_UUID}/albums`
    );
    expect(res.status).toBe(502);
  });
});
