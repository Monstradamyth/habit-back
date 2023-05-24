import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { CourseEntity } from "../course/entity";
import { UserEntity } from "@/services/user/modules/user/entity";

@Entity()
export class HabitEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  status: boolean;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => CourseEntity, (course) => course.habit)
  courses: CourseEntity[];

  @ManyToOne(() => UserEntity, (user) => user.habits, { 
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: UserEntity;
}
