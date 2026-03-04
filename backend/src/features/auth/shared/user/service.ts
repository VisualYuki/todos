import { hashUtils } from "@/shared/hash";
import { userDatabase } from "./database";
import { User } from "./types";

export const userService = {
  async isValidUser(user: User) {
    const userData = await userDatabase.selectByLogin(user.login);

    if (!user || !userData) {
      return false;
    }

    const isValidPassword = await hashUtils.compare(
      user.password,
      userData.password
    );

    if (!isValidPassword) {
      return false;
    }

    return true;
  },
  async isUserExist(login: User["login"]) {
    const userData = await userDatabase.selectByLogin(login);

    if (!!userData) {
      return true;
    }

    return false;
  },
};
