import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:8536",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());
