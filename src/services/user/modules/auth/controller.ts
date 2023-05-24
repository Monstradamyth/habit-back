import { Router } from "express";
import { authService } from "./service";
import { SignInUserDTO, SignUpUserDTO } from "../user/models";
import { defaultErrorHandler } from "@/core/error";

const authController = Router();
export default authController;

authController.post("/signin", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { email, password } = req.body as SignInUserDTO;

    const result = await authService.signIn({ email, password });

    if (!result) {
      res.status(401).send({ error: "Invalid credentials" });
    } else {
      res.status(200).send(result);
    }
  }, next);
});

authController.post("/signup", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { ...userData } = req.body as SignUpUserDTO;

    const result = await authService.signUp(userData);

    if (!result) {
      res.status(401).send({ error: "Invalid credentials" });
    } else {
      res.status(200).send(result);
    }
  }, next);
});