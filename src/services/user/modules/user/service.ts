import { DataSource, Repository } from "typeorm";
import { UserEntity } from "./entity";
import { CreateUserDTO, UpdateUserDTO } from "./models";
import { UserRepository } from "@/services/habit/db";

interface IUserService {
  createUser(user: CreateUserDTO): Promise<CreateUserDTO>;
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  updateUser(user: UserEntity): Promise<UserEntity>;
  updateMyUser(user: UpdateUserDTO, userId: string): Promise<UserEntity>;
  deleteUser(id: string): Promise<void>;
  getUsers(): Promise<UserEntity[]>;
}

class UserService implements IUserService {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = UserRepository;
  }

  async createUser(user: CreateUserDTO): Promise<UserEntity> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async getUserById(id: UserEntity["id"]): Promise<UserEntity | null> {
    if(!id) return null

    return this.userRepository.findOne({
      where: { id },
    });
  }

  async getUserByEmail(email: UserEntity["email"]): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async updateMyUser(
    user: UpdateUserDTO,
    userId: UserEntity["id"]
  ): Promise<UserEntity> {
    const oldUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!oldUser) {
      throw new Error("User with this id doesn't exist");
    }

    const updatedUser = this.userRepository.create({
      ...oldUser,
      ...user,
    });

    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: UserEntity["id"]): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
}

export const userService = new UserService();
