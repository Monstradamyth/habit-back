import { Router } from "express";
import userController from "./services/user/modules/user/controller";
import passport from "passport";
import authController from "./services/user/modules/auth/controller";
import courseController from "./services/habit/modules/course/controller";
import taskController from "./services/habit/modules/task/controller";
import attemptController from "./services/habit/modules/attempt/controller";
import habitController from "./services/habit/modules/habit/controller";

const router = Router();

router.use("/auth", authController);

router.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  userController
);

router.use(
  "/habits",
  passport.authenticate("jwt", { session: false }),
  habitController
);

router.use(
  "/courses",
  passport.authenticate("jwt", { session: false }),
  courseController
);

router.use(
  "/tasks",
  passport.authenticate("jwt", { session: false }),
  taskController
);

router.use(
  "/attempts",
  passport.authenticate("jwt", { session: false }),
  attemptController
);

export default router;
