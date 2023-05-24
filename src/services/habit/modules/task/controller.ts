import { Router } from "express";
import { taskService } from "./service";
import { CreateTaskDTO, UpdateTaskDTO } from "./models";
import { defaultErrorHandler } from "@/core/error";
import { courseService } from "../course/service";

const taskController = Router();
export default taskController;

// GET
taskController.get("/", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const tasks = await taskService.getAllTasks();

    return res.status(200).send(tasks);
  }, next);
});

taskController.get("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const task = await taskService.getTaskById(id);

    return res.status(200).send(task);
  }, next);
});

taskController.get("/course/:courseId", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { courseId } = req.params;

    const tasks = await taskService.getTasksByCourseId(courseId);

    return res.status(200).send(tasks);
  }, next);
});

// POST
taskController.post("/", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { title, description, courseId, taskFrequency } = req.body as CreateTaskDTO & {
      courseId: string;
    };

    const course = await courseService.getCourseById(courseId);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    const result = await taskService.createTask({
      title,
      description,
      course,
      taskFrequency
    });

    return res.status(201).send(result);
  }, next);
});

// PATCH
taskController.patch("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;
    const { title, description } = req.body as UpdateTaskDTO;

    const result = await taskService.updateTask(id, {
      title,
      description,
    });

    return res.status(200).send(result);
  }, next);
});

// DELETE
taskController.delete("/:id", (req, res, next) => {
  return defaultErrorHandler(async () => {
    const { id } = req.params;

    const result = await taskService.deleteTask(id);

    return res.status(200).send(result);
  }, next);
});