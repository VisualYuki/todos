import express, { type Request } from "express";

import { userService } from "./";
import { tokenService } from "../token/service";
import { User } from "./types";
import { TokenPayload } from "../token/types";
import { createResponse } from "@/shared/express";
import { REFRESH_TOKEN_EXPIRES_IN } from "../token";

export const userRouter = express.Router();

userRouter.post("/auth/login", async (req: Request<{}, any, User>, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json(
      createResponse({
        error: "login and password are required",
      })
    );
  }

  const isValidUser = await userService.isValidUser({ login, password });

  if (isValidUser) {
    const payload: TokenPayload = {
      login,
    };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken.token, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRES_IN,
    });

    return res.json(
      createResponse({
        data: {
          accessToken: accessToken,
        },
      })
    );
  }

  return res.status(401).json(
    createResponse({
      error: "invalid auth data",
    })
  );
});
