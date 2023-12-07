import request from "supertest";
import { app } from "../src/index";
import connectDb from "../src/helpers/connectDb";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectDb();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("ExpressFlow", () => {
  it("should respond with status 200 for GET requests to /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should respond with status 404 for unknown routes", async () => {
    const response = await request(app).get("/nonexistent-route");
    expect(response.status).toBe(404);
  });
});
