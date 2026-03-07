import express, { type Request } from "express";
import * as v from "valibot";

import { parseUser, userDatabase, userService } from "../shared/user";
import { tokenService } from "../shared/token/service";
import { User } from "../shared/user/types";
import { TokenPayload } from "../shared/token/types";
import { createResponse } from "@/shared/express";
import { REFRESH_TOKEN_EXPIRES_IN } from "../shared/token";

export const loginRouter = express.Router();

loginRouter.post("/auth/login", async (req: Request<{}, any, User>, res) => {
  const { login, password } = req.body;

  const parseResult = parseUser({ login, password });

  if (!parseResult.success) {
    const flatten = v.flatten(parseResult.issues);

    res.status(400).json(createResponse({ error: { ...flatten.nested } }));
    return;
  }

  const isValidUser = await userService.isValidUser({ login, password });

  if (isValidUser) {
    const { id } = await userDatabase.selectByLogin(login);
    const payload: TokenPayload = {
      userId: id,
    };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = await tokenService.generateRefreshToken(payload, id);

    res.cookie("refreshToken", refreshToken.token, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
    });

    return res.json(
      createResponse({
        data: {
          accessToken: accessToken,
        },
      })
    );
  } else {
    return res.status(401).json(
      createResponse({
        error: "login or password is invalid",
      })
    );
  }
});
