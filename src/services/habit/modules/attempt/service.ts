import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { AttemptRepository } from "../../db";
import { AttemptEntity } from "./entity";
import { CreateAttemptDTO, UpdateAttemptDTO } from "./models";

export enum AttemptStatus {
  "FINISHED" = "finished",
  "ACTIVE" = "active",
  "FAILED" = "failed",
}

interface IAttemptServiceGet {
  getAttemptById(id: AttemptEntity["id"]): Promise<AttemptEntity | null>;
  getAttemptsByTaskId(
    taskId: AttemptEntity["task"]["id"]
  ): Promise<AttemptEntity[]>;
}

interface IAttemptServiceActions {
  finishAttempt(attemptId: AttemptEntity["id"]): Promise<UpdateResult>;
  failAttempt(attemptId: AttemptEntity["id"]): Promise<UpdateResult>;
}

interface IAttemptServiceUpdate {
  updateAttempt(
    id: AttemptEntity["id"],
    attempt: UpdateAttemptDTO
  ): Promise<UpdateResult>;
}

interface IAttemptServiceCreate {
  createAttempt(attempt: CreateAttemptDTO): Promise<AttemptEntity>;
}

interface IAttemptServiceDelete {
  deleteAttempt(attemptId: AttemptEntity["id"]): Promise<DeleteResult>;
}

export interface IAttemptService
  extends IAttemptServiceGet,
    IAttemptServiceCreate,
    IAttemptServiceUpdate,
    IAttemptServiceDelete,
    IAttemptServiceActions {}

class AttemptService implements IAttemptService {
  constructor(private attemptRepository: Repository<AttemptEntity>) {}

  // GET
  async getAttemptById(id: AttemptEntity["id"]): Promise<AttemptEntity | null> {
    return this.attemptRepository.findOne({
      where: { id },
      relations: ["task"],
    });
  }

  async getAttemptsByTaskId(
    taskId: AttemptEntity["task"]["id"]
  ): Promise<AttemptEntity[]> {
    return this.attemptRepository.find({
      where: {
        task: {
          id: taskId,
        },
      },
    });
  }

  // CREATE
  async createAttempt(attempt: CreateAttemptDTO): Promise<AttemptEntity> {
    const newAttempt = this.attemptRepository.create({
      ...attempt,
      status: AttemptStatus.ACTIVE,
    });

    return this.attemptRepository.save(newAttempt);
  }

  // UPDATE
  async updateAttempt(
    id: AttemptEntity["id"],
    attempt: UpdateAttemptDTO
  ): Promise<UpdateResult> {
    return this.attemptRepository.update(id, attempt);
  }

  // DELETE
  async deleteAttempt(id: AttemptEntity["id"]): Promise<DeleteResult> {
    return this.attemptRepository.delete(id);
  }

  // ACTIONS
  async finishAttempt(id: AttemptEntity["id"]): Promise<UpdateResult> {
    const attempt = await this.getAttemptById(id);

    if (!attempt) {
      throw new Error("Attempt with this id doesn't exist");
    }

    attempt.status = AttemptStatus.FINISHED;
    attempt.endDate = new Date().getTime();

    return this.attemptRepository.update(id, attempt);
  }

  async failAttempt(id: AttemptEntity["id"]): Promise<UpdateResult> {
    const attempt = await this.getAttemptById(id);

    if (!attempt) {
      throw new Error("Attempt with this id doesn't exist");
    }

    attempt.status = AttemptStatus.FAILED;
    attempt.endDate = new Date().getTime();

    return this.attemptRepository.update(id, attempt);
  }
}

export const attemptService = new AttemptService(AttemptRepository);
