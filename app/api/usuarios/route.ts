// app/api/usuarios/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/modules/user/user-service";
import { SupabaseUserRepository } from "@/modules/user/supabase-user-repository";
import { ValidationError } from "@/errors/validation-error";


const userService = new UserService(new SupabaseUserRepository());

/**
 * Cria um novo usuário no sistema.
 *
 * Esta função recebe uma requisição POST contendo os dados do usuário
 * (nome, email, senha, telefone e nível de acesso), valida e registra
 * o usuário no banco de dados através do serviço de usuários.
 *
 * @param request - Objeto `NextRequest` contendo o corpo da requisição JSON.
 * @returns `NextResponse` com mensagem de sucesso ou erro de validação/erro interno.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await userService.createUser({
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      telefone: body.telefone,
      nivelAcessoId: body.nivelAcessoId ?? null,
    });

    return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Erro ao criar usuário:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

/**
 * Lista todos os usuários cadastrados no sistema.
 *
 * Esta função responde a requisições GET feitas à rota `/api/usuarios`,
 * buscando todos os usuários no banco de dados através do `userService`.
 *
 * @returns {Promise<NextResponse>} Uma resposta JSON contendo a lista de usuários (HTTP 200)
 *          ou uma mensagem de erro em caso de falha (HTTP 500).
 */

export async function GET() {
  try {
    const usuarios = await userService.listUsers();

    return NextResponse.json(usuarios, { status: 200 });
  } catch (err: any) {
    console.error("Erro ao listar usuários:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
