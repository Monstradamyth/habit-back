import { HabitEntity } from "../habit/entity";
import { CourseEntity } from "./entity";

export type CreateCourseDTO = Pick<
  CourseEntity,
  "successPercentage" | "taskFrequency" | "endDate"
> & {
  habit: HabitEntity;
};

export type UpdateCourseDTO = Partial<CreateCourseDTO> &
  Pick<CourseEntity, "id">;
