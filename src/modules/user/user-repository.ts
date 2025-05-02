// src/modules/user/user-repository.ts
export interface User {
    id?: string;
    nome: string;
    email: string;
    senha: string;  
    nivelAcessoId?: number;
    telefone?: string;
    ativo?: boolean;
  }

  export interface UserRepository {
    create(user: User): Promise<void>;
    findAll(): Promise<User[]>;
    update(user: User): Promise<void>;
    inactivate(id: string): Promise<void>;
  }