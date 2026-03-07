import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "@/core/express";
import { Client } from "pg";
import { connectToDatabase } from "@/core/database";
import { tokenRouter, userDatabase } from "../auth";
import { tokenDatabase } from "../auth/shared/token";
import { todosDatabase } from "./database";
import { registrationRouter } from "../auth/registration";
import { todosRouter } from "./routes";

let client: Client;
const testLogin = "correct-login";
const testPassword = "correct-password";
let accessToken: string = "";
const app = createApp();
//let userId: number;

beforeAll(async () => {
  client = await connectToDatabase("todos-test");
  await userDatabase.initUserSchema(client);
  await tokenDatabase.initTokenSchema(client);
  await todosDatabase.initTodosSchema(client);

  app.use(registrationRouter);
  app.use(tokenRouter);
  app.use(todosRouter);
});

beforeEach(async () => {
  const registrationRes = await request(app)
    .post("/auth/registration")
    .send({ login: testLogin, password: testPassword })
    .expect(200);

  accessToken = registrationRes.body.data.accessToken.token;
});

afterEach(async () => {
  await userDatabase.deleteAll();
});

describe("", () => {
  it("", async () => {
    const todosRes = await request(app)
      .post("/todos/add")

      .expect(401);

    expect(todosRes.body.error).toBe("Access token is not set");
  });

  it("", async () => {
    const todosRes = await request(app)
      .post("/todos/add")
      .set("authorization", accessToken)
      .send({ title: "title1" })
      .expect(200);

    expect(todosRes.body.data.todo.title).toBe("title1");
    expect(todosRes.body.data.todo.description).toBe(null);
    expect(todosRes.body.data.todo.completed).toBe(false);
  });
});
