import { Repository } from "typeorm";
import { UserEntity } from "../user/entity";
import { CreateUserDTO, SignInUserDTO } from "../user/models";
import jwt from "jsonwebtoken";
import { secretKey } from "./config";
import { UserRepository } from "@/services/habit/db";

interface IAuthService {
  signIn(userData: SignInUserDTO): Promise<{ token: string } | false>;
}

class AuthService implements IAuthService {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = UserRepository;
  }

  async signIn(userData: SignInUserDTO) {
    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (!user || user.password !== userData.password) {
      return false;
    }

    const token = jwt.sign({ sub: user.id }, secretKey);

    return { token };
  }

  async signUp(userData: CreateUserDTO) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (user) {
        return false;
      }

      const newUser = await this.userRepository.save(userData);

      return newUser;
    } catch (err) {
      console.log(err);
    }
  }
}

export const authService = new AuthService();
