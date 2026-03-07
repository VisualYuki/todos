import { createResponse } from "@/shared/express";
import express, { type Request } from "express";
import { tokenDatabase } from "../shared/token/database";
import { tokenService } from "../shared/token/service";

export const tokenRouter = express.Router();

tokenRouter.post("/auth/refresh", async (req: Request<{}, any, any>, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res
      .status(401)
      .json(createResponse({ error: "refresh token is required" }));

  const refreshSession = await tokenDatabase.selectByToken(refreshToken);

  if (!refreshSession) {
    return res
      .status(401)
      .json(createResponse({ error: "refresh token is not exist" }));
  }

  if (tokenService.isRefreshTokenExpired(refreshToken)) {
    return res
      .status(401)
      .json(createResponse({ error: "refresh token is expired" }));
  }

  const accessToken = tokenService.generateAccessToken({
    userId: refreshSession.user_id,
  });

  return res.json(
    createResponse({
      data: {
        accessToken: accessToken,
      },
    })
  );
});
