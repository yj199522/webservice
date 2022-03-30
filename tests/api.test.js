const app = require("../api");
const request = require("supertest");

describe("GET /healthz", () => {
    test("Testing GET API", async() => {
        const response = await request(app).get("/healthz");
        expect(response.body).toEqual("OK1");
        expect(response.statusCode).toBe(200);
    });
});
