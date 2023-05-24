import { UserEntity } from "./entity";

export type CreateUserDTO = Omit<UserEntity, 'id'>
export type UpdateUserDTO = Omit<Partial<UserEntity>, 'id' | 'habits'>
export type SignInUserDTO = Pick<UserEntity, 'email' | 'password'>
export type SignUpUserDTO = Omit<UserEntity, 'id'>
