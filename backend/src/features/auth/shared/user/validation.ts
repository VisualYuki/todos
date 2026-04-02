import * as v from "valibot";
import { User } from "./types";

const registrationSchema = v.object({
  login: v.pipe(v.string(), v.nonEmpty(), v.minLength(4), v.maxLength(30)),
  password: v.pipe(v.string(), v.nonEmpty(), v.minLength(8)),
});

export const parseUser = (user: User) => {
  return v.safeParse(registrationSchema, {
    login: user.login,
    password: user.password,
  });
};
