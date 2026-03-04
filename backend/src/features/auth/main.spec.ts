import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import request from "supertest";
import { app } from "@/core/express";
import { userRouter } from "./user/routes";
import { connectToDatabase } from "@/core/database";
import { Client } from "pg";
import { userDatabase } from "./user/database";
import { hashUtils } from "@/shared/hash";
import { REFRESH_TOKEN_EXPIRES_IN, tokenDatabase } from "./shared/token";
import * as cookie from "cookie";
import { tokenRouter } from "./refresh-token/routes";

app.use(userRouter);
app.use(tokenRouter);

let client: Client | null = null;

describe("/auth/login", () => {
  beforeAll(async () => {
    client = await connectToDatabase("todos-test");
    await userDatabase.initUserSchema(client);
    await tokenDatabase.initTokenSchema(client);
    const hashedPassword = await hashUtils.hash("password-test");
    const login = "login-test";

    try {
      await userDatabase.insertUser(login, hashedPassword);
    } catch {}
  });

  afterAll(async () => {
    try {
      await userDatabase.deleteUser("login-test");
    } catch {}
  });

  it("success auth", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        login: "login-test",
        password: "password-test",
      })
      .expect(200);

    expect(res.body.data).toHaveProperty("accessToken");

    let cookies = cookie.parseSetCookie(res.headers["set-cookie"][0]);

    expect(cookies.httpOnly).toBeTruthy();
    expect(cookies.name).toBe("refreshToken");
    expect(cookies.value).toBeTruthy();
  });

  it("return 401 error if login or password is incorrect", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        login: "invalid login",
        password: "invalid password",
      })
      .expect(401);

    expect(res.body.data).toBeUndefined();
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("return 400 error if password is empty", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        login: "some login",
        password: "",
      })
      .expect(400);

    expect(res.body.error).toBe("login and password are required");
  });

  it("return 400 error if login is empty", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        login: "",
        password: "some login",
      })
      .expect(400);

    expect(res.body.error).toBe("login and password are required");
  });

  it("return 400 error if login and password is empty", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        login: "",
        password: "",
      })
      .expect(400);

    expect(res.body.error).toBe("login and password are required");
  });
});

describe("/auth/refresh", () => {
  beforeAll(async () => {
    client = await connectToDatabase("todos-test");
    await userDatabase.initUserSchema(client);
    await tokenDatabase.initTokenSchema(client);
    const hashedPassword = await hashUtils.hash("password-test");
    const login = "login-test";

    try {
      await userDatabase.insertUser(login, hashedPassword);
    } catch {}
  });

  afterAll(async () => {
    try {
      await userDatabase.deleteUser("login-test");
    } catch {}
  });

  afterEach(async () => {
    try {
      await tokenDatabase.removeByUserId("login-test");
    } catch {}
  });

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
    const res = await request(app).post("/auth/login").send({
      login: "login-test",
      password: "password-test",
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
      .post("/auth/login")
      .send({
        login: "login-test",
        password: "password-test",
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
