import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

describe("API Documentation", () => {
  describe("GET /api/docs/openapi.json", () => {
    it("should return 200 with OpenAPI 3.1.0 spec", async () => {
      const res = await request(app).get("/api/docs/openapi.json");
      expect(res.status).toBe(200);
      expect(res.body.openapi).toBe("3.1.0");
      expect(res.body.info.title).toBe("Metal Setlist Builder API");
    });

    it("should contain all API paths", async () => {
      const res = await request(app).get("/api/docs/openapi.json");
      const paths = Object.keys(res.body.paths);
      expect(paths).toContain("/health");
      expect(paths).toContain("/api/artists/search");
      expect(paths).toContain("/api/artists/{id}/albums");
      expect(paths).toContain("/api/albums/{id}/tracks");
    });

    it("should define all component schemas", async () => {
      const res = await request(app).get("/api/docs/openapi.json");
      const schemas = Object.keys(res.body.components.schemas);
      expect(schemas).toContain("HealthResponse");
      expect(schemas).toContain("ArtistSearchResult");
      expect(schemas).toContain("AlbumResult");
      expect(schemas).toContain("TrackResult");
      expect(schemas).toContain("ApiErrorResponse");
    });
  });

  describe("GET /api/docs", () => {
    it("should return 200 with HTML (Scalar UI)", async () => {
      const res = await request(app).get("/api/docs");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/html/);
    });
  });
});
