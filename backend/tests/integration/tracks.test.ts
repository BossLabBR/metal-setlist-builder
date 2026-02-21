import request from "supertest";
import { createApp } from "../../src/app";
import * as musicbrainzClient from "../../src/services/musicbrainzClient";
import { cache } from "../../src/utils/cache";

jest.mock("../../src/services/musicbrainzClient");

const mockMbGet = musicbrainzClient.mbGet as jest.MockedFunction<
  typeof musicbrainzClient.mbGet
>;

const app = createApp();
const VALID_UUID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
const RELEASE_MBID = "11111111-2222-3333-4444-555555555555";

describe("GET /api/albums/:id/tracks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it("should return 200 with an array of tracks", async () => {
    mockMbGet
      .mockResolvedValueOnce({
        releases: [
          { id: RELEASE_MBID, title: "Album", status: "Official", date: "1986" },
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
                title: "Angel of Death",
                position: 1,
                length: 294000,
                recording: { id: "r1", title: "Angel of Death", length: 294000 },
              },
            ],
          },
        ],
      });

    const res = await request(app).get(`/api/albums/${VALID_UUID}/tracks`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "r1",
        title: "Angel of Death",
        position: 1,
        duration: "4:54",
        disc: 1,
      },
    ]);
  });

  it("should return 400 for invalid ID", async () => {
    const res = await request(app).get("/api/albums/invalid-id/tracks");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid ID format" });
  });

  it("should return 404 when no releases found", async () => {
    mockMbGet.mockResolvedValueOnce({
      releases: [],
      "release-offset": 0,
      "release-count": 0,
    });

    const res = await request(app).get(`/api/albums/${VALID_UUID}/tracks`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "No releases found for this album",
    });
  });

  it("should handle tracks with null duration", async () => {
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
                title: "Track",
                position: 1,
                length: null,
                recording: { id: "r1", title: "Track", length: null },
              },
            ],
          },
        ],
      });

    const res = await request(app).get(`/api/albums/${VALID_UUID}/tracks`);
    expect(res.status).toBe(200);
    expect(res.body[0].duration).toBeNull();
  });
});
