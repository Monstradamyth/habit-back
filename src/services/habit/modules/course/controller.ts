import { Router } from "express";
import { courseService } from "./service";
import { CreateCourseDTO } from "./models";
import { defaultErrorHandler } from "@/core/error";
import { getUserFromRequest } from "@/core/user";
import { habitService } from "../habit/service";
import { attemptService } from "../attempt/service";
import { taskService } from "../task/service";

const courseController = Router();
export default courseController;

// GET
courseController.get("/", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const courses = await courseService.getAllCourses();

    return res.status(200).send(courses);
  }, next);
});

courseController.get("/:id", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    return res.status(200).send(course);
  }, next);
});

courseController.get("/habit/:id", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const courses = await courseService.getCoursesByHabitId(id);

    return res.status(200).send(courses);
  }, next);
});

// POST
courseController.post("/", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { successPercentage, habitId, taskFrequency, endDate } =
      req.body as CreateCourseDTO & { habitId: string };

    const habit = await habitService.getHabitById(habitId);

    if (!habit) {
      return res.status(404).send("Habit not found");
    }

    const result = await courseService.createCourse({
      habit,
      successPercentage,
      taskFrequency,
      endDate,
    });

    return res.status(201).send(result);
  }, next);
});

// PATCH
courseController.patch("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const result = courseService.startCourse(id);

    return res.status(200).send(result);
  }, next);
});

// DELETE
courseController.delete("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const result = courseService.deleteCourse(id);

    return res.status(200).send(result);
  }, next);
});

// ACTIONS

courseController.patch("/:id/fail", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const result = await courseService.failCourse(id);

    if (!result.affected) {
      return res.status(404).send("Course not found");
    }

    return res.status(200).send({});
  }, next);
});

courseController.post("/:id/start", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const tasks = await taskService.getTasksByCourseId(id);
    const task = tasks.pop();

    if (!task) {
      return res.status(404).send("Task not found");
    }

    const result = await courseService.startCourse(id);

    if (!result.affected) {
      return res.status(404).send("Course not found");
    }

    const attempt = await attemptService.createAttempt({
      task,
      startDate: Date.now(),
    });

    return res.status(200).send(attempt);
  }, next);
});
