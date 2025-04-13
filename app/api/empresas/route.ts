import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createServerClient({ req, res: NextResponse }, { cookies });

  // 🔐 Verifica se o usuário está autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }

  // 🔐 Verifica se o usuário tem permissão (admin)
  const { data: perfil, error: perfilError } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', user.id)
    .single();

  if (perfilError || perfil?.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso restrito a administradores.' }, { status: 403 });
  }

  // 📥 Pega os dados do corpo da requisição
  const { nome, cnpj } = await req.json();

  if (!nome || !cnpj) {
    return NextResponse.json({ error: 'Nome e CNPJ são obrigatórios.' }, { status: 400 });
  }

  // 💾 Insere a empresa
  const { error: insertError } = await supabase
    .from('empresas')
    .insert([{ nome, cnpj }]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ sucesso: true });
}
