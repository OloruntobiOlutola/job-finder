import request from "supertest";
import app from "../../index";

describe("GET /users", () => {
  it("responds with a json message", async () =>
    request(app)
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("length");
        expect(response.body.length).toBe(1);
      }));
});
