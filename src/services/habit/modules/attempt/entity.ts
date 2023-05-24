import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TaskEntity } from "../task/entity";

@Entity()
export class AttemptEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "bigint" })
  endDate: number;

  @Column({ nullable: false, type: "bigint" })
  startDate: number;

  @Column()
  status: string;

  @ManyToOne(() => TaskEntity, (task) => task.attempts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  task: TaskEntity;
}
