import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:8536",
      credentials: true,
    })
  );

  app.use(express.json());

  app.use(cookieParser());

  return app;
};

export const app = createApp();
