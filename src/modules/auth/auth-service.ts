// src/modules/auth/auth-service.ts
import { AuthRepository } from "./auth-repository";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async login(email: string, password: string) {
    await this.authRepository.login(email, password);
  }
}
