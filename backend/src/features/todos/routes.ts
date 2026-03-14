import { createResponse } from "@/shared/express";
import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../auth/shared/token";
import { todosDatabase } from "./database";

export const todosRouter = Router();

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .send(createResponse({ error: "Access token is not set" }));
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send(createResponse({ error: "Access token is expired" }));
    }

    //@ts-ignore
    req.user = decoded;
    next();
  });
};

todosRouter.post(
  "/todos/add",
  authMiddleware,
  async (req: Request, res, next) => {
    const { title, description, completed } = req.body;

    const dbRow = await todosDatabase.insert({
      userId: req.user.userId,
      title,
      completed,
      description,
    });

    return res.status(200).send(createResponse({ data: { todo: dbRow } }));
  }
);

todosRouter.post(
  "/todos/delete",
  authMiddleware,
  async (req: Request<{}, any, { id: number }>, res) => {
    const { id } = req.body;

    const deleteResult = await todosDatabase.deleteById(id);

    if (deleteResult) {
      return res.status(200).send();
    } else {
      return res.status(500).send();
    }
  }
);

todosRouter.post(
  "/todos/update",
  authMiddleware,
  async (req: Request<{}, any, any>, res) => {
    const { id, title, description, completed } = req.body;

    let result;

    if (title) {
      result = await todosDatabase.updateTitle(id, title);
    }

    if (description) {
      result = await todosDatabase.updateDescription(id, description);
    }

    if (completed) {
      result = await todosDatabase.updateCompleted(id, completed);
    }

    return res.status(200).send(createResponse({ data: { todo: result } }));
  }
);

todosRouter.post(
  "/todos/all",
  authMiddleware,
  async (req: Request<{}, any, any>, res) => {
    let result = await todosDatabase.selectByUserId(req.user.userId);

    return res.status(200).send(createResponse({ data: { todos: result } }));
  }
);
