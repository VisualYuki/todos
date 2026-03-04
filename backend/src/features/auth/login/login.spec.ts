import { afterEach, beforeAll, describe, expect, it, test } from "vitest";
import { userDatabase, userSql } from "../shared/user";
import { connectToDatabase } from "@/core/database";
import { REFRESH_TOKEN_EXPIRES_IN, tokenDatabase } from "../shared/token";
import { Client } from "pg";
import { app } from "@/core/express";
import request from "supertest";
import { loginRouter } from "./routes";
import { parseSetCookie } from "cookie";
import { registrationRouter } from "../registration";

let client: Client;
const testLogin = "correct-login";
const testPassword = "correct-password";

beforeAll(async () => {
  client = await connectToDatabase("todos-test");
  await userDatabase.initUserSchema(client);
  await tokenDatabase.initTokenSchema(client);

  app.use(registrationRouter);
  app.use(loginRouter);
});

afterEach(async () => {
  await userDatabase.deleteAll();
});

describe("", async () => {
  it("error response if login and password is empty", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ login: "", password: "" });

    expect(res.status).toBe(400);

    expect(res.body.error).toBeTruthy();
  });

  it("error response if login and password is not string", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ login: undefined, password: "" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("error response if login length is less than 4", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ login: "123", password: testPassword });

    expect(res.status).toBe(400);
    expect(res.body.error.login).toBeTruthy();
  });

  it("error response if password length is less than 8", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ login: testLogin, password: "1234567" });

    expect(res.status).toBe(400);
    expect(res.body.error.password).toBeTruthy();
  });

  describe("success response", () => {
    it("200 response", async () => {
      const registrationRes = await request(app)
        .post("/auth/registration")
        .send({ login: testLogin, password: testPassword })
        .expect(200);

      const loginRes = await request(app)
        .post("/auth/login")
        .send({ login: testLogin, password: testPassword })
        .expect(200);
    });

    it("with accessToken and refreshToken", async () => {
      const registrationRes = await request(app)
        .post("/auth/registration")
        .send({ login: testLogin, password: testPassword })
        .expect(200);

      const loginRes = await request(app)
        .post("/auth/login")
        .send({ login: testLogin, password: testPassword })
        .expect(200);

      const cookies = parseSetCookie(loginRes.headers["set-cookie"][0]);

      expect(loginRes.body.data.accessToken).toBeTruthy();
      expect(cookies.name).toBe("refreshToken");
      expect(cookies.value).toBeTruthy();
      expect(cookies.maxAge).toBe(REFRESH_TOKEN_EXPIRES_IN);
    });
  });
});
