import { HabitEntity } from "@/services/habit/modules/habit/entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => HabitEntity, (habit) => habit) habits: HabitEntity[];
}
