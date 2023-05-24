import "reflect-metadata";
import { DataSource } from "typeorm";
import { AttemptEntity } from "../modules/attempt/entity";
import { CourseEntity } from "../modules/course/entity";
import { HabitEntity } from "../modules/habit/entity";
import { TaskEntity } from "../modules/task/entity";
import { UserEntity } from "@/services/user/modules/user/entity";

const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "1234",
  database: "Habits",
  logging: true,
  synchronize: true,
  entities: [UserEntity, HabitEntity, CourseEntity, TaskEntity, AttemptEntity],
});

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export const Manager = myDataSource.manager;
export const HabitRepository = myDataSource.getRepository(HabitEntity);
export const CourseRepository = myDataSource.getRepository(CourseEntity);
export const TaskRepository = myDataSource.getRepository(TaskEntity);
export const AttemptRepository = myDataSource.getRepository(AttemptEntity);
export const UserRepository = myDataSource.getRepository(UserEntity);
