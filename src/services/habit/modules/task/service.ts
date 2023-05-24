import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { TaskRepository } from "../../db";
import { TaskEntity } from "./entity";
import { CreateTaskDTO, UpdateTaskDTO } from "./models";

interface ITaskServiceGet {
  getAllTasks(): Promise<TaskEntity[]>;
  getTaskById(id: TaskEntity["id"]): Promise<TaskEntity | null>;
  getTasksByCourseId(
    courseId: TaskEntity["course"]["id"]
  ): Promise<TaskEntity[]>;
}

interface ITaskServiceCreate {
  createTask(task: CreateTaskDTO): Promise<TaskEntity>;
}

interface ITaskServiceUpdate {
  updateTask(id: TaskEntity["id"], task: UpdateTaskDTO): Promise<UpdateResult>;
}

interface ITaskServiceDelete {
  deleteTask(id: TaskEntity["id"]): Promise<DeleteResult>;
}
export interface ITaskService
  extends ITaskServiceGet,
    ITaskServiceCreate,
    ITaskServiceUpdate,
    ITaskServiceDelete {}

class TaskService implements ITaskService {
  constructor(private taskRepository: Repository<TaskEntity>) {}

  // GET
  private defaultRelations = {
    relations: {
      attempts: true,
    },
  };

  async getAllTasks(): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      ...this.defaultRelations,
    });
  }

  async getTasksByCourseId(
    courseId: TaskEntity["course"]["id"]
  ): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      where: {
        course: {
          id: courseId,
        },
      },
      ...this.defaultRelations,
    });
  }

  async getTaskById(id: TaskEntity["id"]): Promise<TaskEntity | null> {
    return this.taskRepository.findOne({
      where: { id },
      relations: {
        course: true,
        attempts: true,
      },
    });
  }

  // CREATE
  async createTask(task: CreateTaskDTO): Promise<TaskEntity> {
    const newTask = this.taskRepository.create({
      ...task,
    });

    return this.taskRepository.save(newTask);
  }

  // UPDATE
  async updateTask(
    id: TaskEntity["id"],
    task: UpdateTaskDTO
  ): Promise<UpdateResult> {
    return this.taskRepository.update(id, task);
  }

  // DELETE
  async deleteTask(id: TaskEntity["id"]): Promise<DeleteResult> {
    return this.taskRepository.delete({ id });
  }
}

export const taskService = new TaskService(TaskRepository);
