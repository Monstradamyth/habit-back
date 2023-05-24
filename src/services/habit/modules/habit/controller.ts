import { Router } from "express";
import { habitService } from "./service";
import { defaultErrorHandler } from "@/core/error";
import { getUserFromRequest } from "@/core/user";
import { CreateHabitDTO, CreateMyHabitDTO, UpdateHabitDTO } from "./models";
import { userService } from "@/services/user/modules/user/service";

const habitController = Router();
export default habitController;

// GET
habitController.get("/", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const habits = await habitService.getAllHabits();

    return res.status(200).send(habits);
  }, next);
});

habitController.get("/my", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const user = getUserFromRequest(req, res, next);

    const habits = await habitService.getHabitsByUserId(user.id);

    return res.status(200).send(habits);
  }, next);
});

habitController.get("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const habit = await habitService.getHabitById(id);

    if (!habit) {
      return res.status(404).send("Habit not found");
    }

    return res.status(200).send(habit);
  }, next);
});

// POST
habitController.post("/", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { title, description, userId } = req.body as CreateHabitDTO & {
      userId: string;
    };

    const userFromDb = await userService.getUserById(userId);

    if (!userFromDb) {
      return res.status(404).send("User not found");
    }

    const result = await habitService.createHabit({
      title,
      description,
      user: userFromDb,
    });

    return res.status(201).send(result);
  }, next);
});

habitController.post("/my", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const user = getUserFromRequest(req, res, next);

    const userFromDb = await userService.getUserById(user.id);

    if (!userFromDb) {
      return res.status(404).send("User not found");
    }

    const { title, description } = req.body as CreateMyHabitDTO;

    const result = await habitService.createHabit({
      title,
      description,
      user: userFromDb,
    });

    return res.status(201).send(result);
  }, next);
});

// PATCH
habitController.patch("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;
    const { title, description } = req.body as UpdateHabitDTO;

    const result = await habitService.updateHabit(id, {
      title,
      description,
    });

    if (result.affected === 0) {
      return res.status(404).send("Habit not found");
    }

    return res.status(200).send(result);
  }, next);
});

// DELETE
habitController.delete("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    await habitService.deleteHabit(id);

    return res.status(200).send({});
  }, next);
});
