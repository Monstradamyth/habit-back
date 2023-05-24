import { AttemptEntity } from "./entity";

export type CreateAttemptDTO = Pick<AttemptEntity, "task" | "startDate">;
export type UpdateAttemptDTO = Pick<AttemptEntity, "status">;
