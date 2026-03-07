import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { Client } from "pg";
import * as cookie from "cookie";

import { createApp } from "@/core/express";
import { REFRESH_TOKEN_EXPIRES_IN, tokenDatabase } from "../shared/token";
import { connectToDatabase } from "@/core/database";
import { userDatabase } from "../shared/user";
import { registrationRouter } from "../registration";
import { tokenRouter } from "./routes";

let client: Client;
const testLogin = "correct-login";
const testPassword = "correct-password";
const app = createApp();

beforeAll(async () => {
  client = await connectToDatabase("todos-test");
  await userDatabase.initUserSchema(client);
  await tokenDatabase.initTokenSchema(client);

  app.use(registrationRouter);
  app.use(tokenRouter);
});

afterEach(async () => {
  await userDatabase.deleteAll();
});

describe("/auth/refresh", () => {
  it("return error if refresh token isn't set", async () => {
    const res2 = await request(app).post("/auth/refresh").expect(401);

    expect(res2.body.error).toBe("refresh token is required");
  });

  it("return error if refresh token is invalid", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refreshToken=foo`])
      .expect(401);

    expect(res.body.error).toBe("refresh token is not exist");
  });

  it("success refresh token", async () => {
    const res = await request(app).post("/auth/registration").send({
      login: testLogin,
      password: testPassword,
    });

    const refreshCookie = cookie.parseSetCookie(res.headers["set-cookie"][0]);

    const res2 = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refreshToken=${refreshCookie.value}`])
      .expect(200);

    expect(res2.body.data).toHaveProperty("accessToken");

    expect(res2.body.data.accessToken).toBeTruthy();
  });

  it("return error if refresh token is expired", async () => {
    const res1 = await request(app)
      .post("/auth/registration")
      .send({
        login: testLogin,
        password: testPassword,
      })
      .expect(200);

    const refreshCookie = cookie.parseSetCookie(res1.headers["set-cookie"][0]);

    vi.useFakeTimers();

    vi.setSystemTime(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000 + 5000);

    const res2 = await request(app)
      .post("/auth/refresh")
      .set("Cookie", [`refreshToken=${refreshCookie.value}`])
      .expect(401);

    expect(res2.body.error).toBe("refresh token is expired");
  });
});
