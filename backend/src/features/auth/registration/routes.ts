import express, { type Request } from "express";
import * as v from "valibot";

import { User } from "../shared/user/types";
import { createResponse } from "@/shared/express";
import { parseUser, userDatabase, userService } from "../shared/user";
import {
  REFRESH_TOKEN_EXPIRES_IN,
  TokenPayload,
  tokenService,
} from "../shared/token";
import { hashUtils } from "@/shared/hash";

export const registrationRouter = express.Router();

registrationRouter.post(
  "/auth/registration",
  async (req: Request<{}, any, User>, res) => {
    const { login, password } = req.body;

    const parseResult = parseUser({ login, password });

    if (!parseResult.success) {
      const flatten = v.flatten(parseResult.issues);

      res.status(400).json(createResponse({ error: { ...flatten.nested } }));
      return;
    }

    if (await userService.isUserExist(login)) {
      res.status(400).json(createResponse({ error: "User already exists" }));
      return;
    }

    let userId: number;

    try {
      const { id } = await userDatabase.insertUser(
        login,
        await hashUtils.hash(password)
      );

      userId = id;
    } catch {
      res.status(500);
      return;
    }

    const payload: TokenPayload = {
      userId: userId,
    };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = await tokenService.generateRefreshToken(
      payload,
      userId
    );

    res.cookie("refreshToken", refreshToken.token, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
    });

    res.status(200).json(
      createResponse({
        data: {
          accessToken: accessToken,
        },
      })
    );
  }
);
