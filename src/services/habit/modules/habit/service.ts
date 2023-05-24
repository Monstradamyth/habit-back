import { Repository, UpdateResult } from "typeorm";
import { HabitEntity } from "./entity";
import { CreateHabitDTO, UpdateHabitDTO } from "./models";
import { HabitRepository } from "../../db";

interface IHabitServiceGet {
  getAllHabits(): Promise<HabitEntity[]>;
  getHabitById(id: HabitEntity["id"]): Promise<HabitEntity | null>;
  getHabitsByUserId(userId: HabitEntity["user"]["id"]): Promise<HabitEntity[]>;
  getHabitByUserAndHabitId(
    id: HabitEntity["id"],
    userId: HabitEntity["user"]["id"]
  ): Promise<HabitEntity | null>;
}

interface IHabitServiceCreate {
  createHabit(habit: CreateHabitDTO, userId: string): Promise<HabitEntity>;
}

interface IHabitServiceUpdate {
  updateHabit(
    id: HabitEntity["id"],
    habit: UpdateHabitDTO
  ): Promise<UpdateResult>;
}

interface IHabitServiceDelete {
  deleteHabit(id: HabitEntity["id"]): Promise<void>;
}
export interface IHabitService
  extends IHabitServiceGet,
    IHabitServiceCreate,
    IHabitServiceUpdate,
    IHabitServiceDelete {}

class HabitService implements IHabitService {
  constructor(private habitRepository: Repository<HabitEntity>) {}

  // GET
  private defaultRelations = {
    relations: {
      courses: true,
    },
  };

  async getAllHabits(): Promise<HabitEntity[]> {
    return this.habitRepository.find({
      ...this.defaultRelations,
    });
  }

  async getHabitById(id: HabitEntity["id"]): Promise<HabitEntity | null> {
    return this.habitRepository.findOne({
      where: { id },
      ...this.defaultRelations,
    });
  }

  async getHabitByUserAndHabitId(
    id: HabitEntity["id"],
    userId: HabitEntity["user"]["id"]
  ): Promise<HabitEntity | null> {
    return this.habitRepository.findOne({
      where: { id, user: { id: userId } },
      ...this.defaultRelations,
    });
  }

  async getHabitsByUserId(
    userId: HabitEntity["user"]["id"]
  ): Promise<HabitEntity[]> {
    return this.habitRepository.find({
      where: { user: { id: userId } },
      ...this.defaultRelations,
    });
  }

  // CREATE
  async createHabit({
    title,
    description,
    user,
  }: CreateHabitDTO): Promise<HabitEntity> {
    const oldHabit = await this.habitRepository.findOne({
      where: { title, user: { id: user.id } },
      ...this.defaultRelations,
    });

    if (oldHabit) {
      throw new Error("Habit with this title already exists");
    }

    const newHabit = this.habitRepository.create({
      title,
      description,
      user,
      status: false,
    });

    return this.habitRepository.save(newHabit);
  }

  // UPDATE
  async updateHabit(
    id: HabitEntity["id"],
    habit: UpdateHabitDTO
  ): Promise<UpdateResult> {
    return this.habitRepository.update(id, habit);
  }

  // DELETE
  async deleteHabit(id: HabitEntity["id"]): Promise<void> {
    await this.habitRepository.delete(id);
  }
}

export const habitService = new HabitService(HabitRepository);
