import { TaskEntity } from "./entity";

export type CreateTaskDTO = Omit<TaskEntity, "id" | "attempts">;
export type UpdateTaskDTO = Pick<Partial<TaskEntity>, "title" | "description">;
