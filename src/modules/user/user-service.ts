// src/modules/user/user-service.ts
import { UserRepository, User } from "./user-repository";
import { ValidationError } from "@/errors/validation-error"; 

export class UserService {
  constructor(private userRepository: UserRepository) {}

  private validateUser(user: User, isNew = true) {
    if (!user.nome || user.nome.trim().length === 0) {
      throw new ValidationError("Nome é obrigatório");
    }

    if (!user.email || user.email.trim().length === 0) {
      throw new ValidationError("Email é obrigatório");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new ValidationError("Email inválido");
    }

    if (isNew && (!user.senha || user.senha.length < 6)) {
      throw new ValidationError("Senha é obrigatória e deve ter pelo menos 6 caracteres");
    }
  }

  async createUser(user: User) {
    this.validateUser(user, true);
    await this.userRepository.create(user);
  }

  async listUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(user: User) {
    this.validateUser(user, false);
    await this.userRepository.update(user);
  }

  async inactivateUser(id: string) {
    await this.userRepository.inactivate(id);
  }
}
