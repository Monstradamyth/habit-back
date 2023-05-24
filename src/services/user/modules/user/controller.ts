import { Router } from "express";
import { userService } from "./service";
import multer from "multer";
import { defaultErrorHandler } from "@/core/error";

const storageEngine = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const upload = multer({ dest: "uploads/", storage: storageEngine });

const userController = Router();
export default userController;

userController.delete("/me", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const user = req.user;
    if (user) {
      userService.deleteUser(user.id);
      return res.status(200).send(JSON.stringify({ msg: "User deleted" }));
    }

    return res.status(401).send("Unauthorized");
  }, next);
});

userController.patch("/me", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const user = req.user;

    if (user) {
      const updatedUser = await userService.updateMyUser(req.body, user.id);

      return res.status(200).send(updatedUser);
    }

    return res.status(401).send("Unauthorized");
  }, next);
});

userController.get("/", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const users = await userService.getUsers();

    return res.status(200).send(users);
  }, next);
});

userController.get("/me", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const user = req.user;
    if (user) {
      const u = await userService.getUserById(user.id);

      if (u) {
        const { password, avatar, ...rest } = u;

        return res.status(200).send({
          ...rest,
          // I'll change this, once I'll have a domain name
          avatar: avatar ? `http://192.168.1.13:3000/uploads/${avatar}` : null,
        });
      }
    }

    return res.status(401).send("Unauthorized");
  }, next);
});

const cpUpload = upload.any();
userController.patch("/me/avatar", cpUpload, async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const user = req.user;
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    const filename = (req.files as any)[0].filename;

    const updatedUser = await userService.updateMyUser(
      {
        avatar: filename,
      },
      user.id
    );

    return res.status(200).send(updatedUser);
  }, next);
});