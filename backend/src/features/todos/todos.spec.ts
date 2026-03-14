import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import request from "supertest";
import { createApp } from "@/core/express";
import { Client } from "pg";
import { connectToDatabase } from "@/core/database";
import { tokenRouter, userDatabase } from "../auth";
import { ACCESS_TOKEN_EXPIRES_IN, tokenDatabase } from "../auth/shared/token";
import { todosDatabase } from "./database";
import { registrationRouter } from "../auth/registration";
import { todosRouter } from "./routes";
import { description } from "valibot";

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

describe("todos", () => {
  describe("authorization", async () => {
    it("todos request returns error response when access token is not set", async () => {
      const todosRes = await request(app).post("/todos/add").expect(401);

      expect(todosRes.body.error).toBe("Access token is not set");
    });

    it("todos request returns error response when access token is expired", async () => {
      vi.useFakeTimers();

      vi.setSystemTime(Date.now() + ACCESS_TOKEN_EXPIRES_IN * 1000 + 5000);

      const todosRes = await request(app)
        .post("/todos/add")
        .set("authorization", accessToken)
        .send({ title: "title1" })
        .expect(403);

      expect(todosRes.body.error).toBe("Access token is expired");
    });

    it("todos request returns success response when access token is valid", async () => {
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

  describe("delete todo", () => {
    // it("delete request should return 500 error if task id does not exist", async () => {
    //   const todosRes = await request(app)
    //     .post("/todos/delete")
    //     .set("authorization", accessToken)
    //     .send({ id: 510 })
    //     .expect(500);
    // });

    it("delete request should return 200", async () => {
      const addRes = await request(app)
        .post("/todos/add")
        .set("authorization", accessToken)
        .send({ title: "title1" })
        .expect(200);

      const deleteRes = await request(app)
        .post("/todos/delete")
        .set("authorization", accessToken)
        .send({ id: addRes.body.data.todo.id })
        .expect(200);
    });
  });

  describe("update todo", () => {
    it("update request should return 200 with corresponding body", async () => {
      const addRes = await request(app)
        .post("/todos/add")
        .set("authorization", accessToken)
        .send({ title: "title1" })
        .expect(200);

      const updateRes = await request(app)
        .post("/todos/update")
        .set("authorization", accessToken)
        .send({
          id: addRes.body.data.todo.id,
          title: "new title1",
          description: "new description",
          completed: true,
        })
        .expect(200);

      expect(updateRes.body.data.todo.title).toBe("new title1");
      expect(updateRes.body.data.todo.description).toBe("new description");
      expect(updateRes.body.data.todo.completed).toBe(true);
    });
  });

  describe("all todos", () => {
    it("all request should return 200 status and body with array of todos", async () => {
      await request(app)
        .post("/todos/add")
        .set("authorization", accessToken)
        .send({ title: "title1" })
        .expect(200);

      await request(app)
        .post("/todos/add")
        .set("authorization", accessToken)
        .send({ title: "title2" })
        .expect(200);

      const allRes = await request(app)
        .post("/todos/all")
        .set("authorization", accessToken)
        .expect(200);

      expect(allRes.body.data.todos.length).toBe(2);
      expect(allRes.body.data.todos[0].title).toBe("title1");
      expect(allRes.body.data.todos[1].title).toBe("title2");
    });
  });
});
