import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { CourseEntity } from "../course/entity";
import { AttemptEntity } from "../attempt/entity";

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  taskFrequency: number;

  @ManyToOne(() => CourseEntity, (course) => course.tasks, { 
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  course: CourseEntity;

  @OneToMany(() => AttemptEntity, (attempt) => attempt.task)
  attempts: AttemptEntity[];
}
