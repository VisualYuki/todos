import { createResponse } from "@/shared/express";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../auth/shared/token";
import { todosDatabase } from "./database";

export const todosRouter = Router();

todosRouter.post(
  "/todos/add",
  async (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res
        .status(401)
        .send(createResponse({ error: "Access token is not set" }));
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403);
      }

      //@ts-ignore
      req.user = decoded;
      next();
    });
  },
  async (req, res, next) => {
    const { title, description, completed } = req.body;

    const dbRow = await todosDatabase.insert({
      userId: req.user.userId,
      title,
      completed,
      description,
    });

    res.send(createResponse({ data: { todo: dbRow } }));

    debugger;
  }
);
