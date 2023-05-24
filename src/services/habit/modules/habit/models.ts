import { HabitEntity } from "./entity";

export type CreateHabitDTO = Pick<
  HabitEntity,
  "title" | "description" | "user"
>;
export type CreateMyHabitDTO = Pick<HabitEntity, "title" | "description">;
export type UpdateHabitDTO = Pick<
  Partial<HabitEntity>,
  "title" | "description"
>;
