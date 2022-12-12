"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../index"));
describe("GET /users", () => {
    it("responds with a json message", async () => (0, supertest_1.default)(index_1.default)
        .get("/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
        expect(response.body).toHaveProperty("length");
        expect(response.body.length).toBe(1);
    }));
});
