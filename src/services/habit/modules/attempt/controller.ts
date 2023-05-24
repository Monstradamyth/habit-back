import { Router } from "express";
import { attemptService } from "./service";
import { UpdateAttemptDTO } from "./models";
import { taskService } from "../task/service";
import { defaultErrorHandler } from "@/core/error";
import { courseService } from "../course/service";

const attemptController = Router();
export default attemptController;

// GET
attemptController.get("/:id", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;
    const attempt = await attemptService.getAttemptById(id);
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }
    return res.status(200).json(attempt);
  }, next);
});

attemptController.get("/task/:taskId", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { taskId } = req.params;
    const attempts = await attemptService.getAttemptsByTaskId(taskId);
    return res.status(200).json(attempts);
  }, next);
});

// POST
attemptController.post("/", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { taskId } = req.body as { taskId: string };

    const task = await taskService.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const attempt = await attemptService.createAttempt({
      task,
      startDate: Date.now(),
    });
    return res.status(201).json(attempt);
  }, next);
});

// PATCH
attemptController.patch("/:id", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;
    const attempt = await attemptService.getAttemptById(id);
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const { status } = req.body as { status: UpdateAttemptDTO["status"] };
    const updatedAttempt = await attemptService.updateAttempt(id, { status });
    return res.status(200).json(updatedAttempt);
  }, next);
});

// DELETE
attemptController.delete("/:id", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;
    const attempt = await attemptService.deleteAttempt(id);
    return res.status(200).json(attempt);
  }, next);
});

// ACTIONS
attemptController.post("/:id/finish", async (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const attempt = await attemptService.getAttemptById(id);

    if(!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const friquencyInMs = attempt.task.taskFrequency * 60 * 60 * 1000;
    const shouldFinishUntil = Number(attempt.startDate) + friquencyInMs;

    let result;
    if(Date.now() > shouldFinishUntil) {
      result = await attemptService.failAttempt(id);
    } else {
      result = await attemptService.finishAttempt(id);
    }

    if(!result.affected) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const task = await taskService.getTaskById(attempt.task.id);

    if(!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const course = await courseService.getCourseById(task.course.id);
    if(!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if(Number(course.endDate) > Date.now()) {
      await attemptService.createAttempt({
        task: attempt.task,
        startDate: shouldFinishUntil
      });
    } else {
      await courseService.finishCourse(course.id);
    }

    return res.status(200).json(result);
  }, next);
});