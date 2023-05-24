import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { HabitEntity } from "../habit/entity";
import { TaskEntity } from "../task/entity";

@Entity()
export class CourseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  status: string;

  @Column({ nullable: true, type: "bigint" })
  startDate: number;

  @Column({ type: "bigint" })
  endDate: number;

  @Column()
  successPercentage: number;

  @ManyToOne(() => HabitEntity, (habit) => habit.courses, { 
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  habit: HabitEntity;

  @OneToMany(() => TaskEntity, (task) => task.course)
  tasks: TaskEntity[];
}
