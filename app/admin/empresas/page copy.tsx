"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const estados = [
  { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" }, { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" }, { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" }, { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" }, { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" }, { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" }, { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" }, { sigla: "RJ", nome: "Rio de Janeiro" }, { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" }, { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" }
];


function aplicarMascaraTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  } else {
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  }
}

export default function EmpresasPage() {
  const [form, setForm] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    inscricao_municipal: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    ambiente: "homologacao",
    login_prefeitura: "",
    senha_prefeitura: "",
    nome_prefeitura: "",
    codigo_municipio: "",
    uf: "",
    tipo_integracao: "SOAP"
  });

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const maskedValue = name === "cnpj"
      ? value.replace(/\D/g, "").slice(0, 14).replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1/$2").replace(/(\d{4})(\d)/, "$1-$2")
      : name === "cep"
      ? value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{3})$/, "$1-$2")
      : name === "telefone"
      ? aplicarMascaraTelefone(value)
      : value;
    setForm({ ...form, [name]: maskedValue });
  };

  const handleSubmit = async () => {
    setMensagem(null);
    const erro = validarFormulario(form);
    if (erro) {
      setMensagem(erro);
      return;
    }
    const { data: prefeitura, error: errorPref } = await supabase
      .from("prefeituras")
      .insert([
        {
          nome: form.nome_prefeitura,
          codigo_municipio: form.codigo_municipio,
          uf: form.uf,
          tipo_integracao: form.tipo_integracao,
        },
      ])
      .select()
      .single();

    if (errorPref || !prefeitura) {
      setMensagem("Erro ao cadastrar prefeitura: " + (errorPref?.message || "Erro desconhecido"));
      return;
    }

    const { error: errorEmp } = await supabase.from("empresas").insert([
      {
        razao_social: form.razao_social,
        nome_fantasia: form.nome_fantasia,
        cnpj: form.cnpj,
        inscricao_municipal: form.inscricao_municipal,
        email: form.email,
        telefone: form.telefone,
        endereco: form.endereco,
        cidade: form.cidade,
        estado: form.estado,
        cep: form.cep,
        ambiente: form.ambiente,
        login_prefeitura: form.login_prefeitura,
        senha_prefeitura: form.senha_prefeitura,
        plano_id: 1,
        prefeitura_id: prefeitura.id,
      },
    ]);

    if (errorEmp) {
      setMensagem("Erro ao cadastrar empresa: " + (errorEmp?.message || "Erro desconhecido"));
    } else {
      setMensagem("Empresa cadastrada com sucesso");
      setMostrarFormulario(false);
    }
  };

  useEffect(() => {
    const fetchEmpresas = async () => {
      const { data, error } = await supabase
        .from("empresas")
        .select("id, razao_social, nome_fantasia, cnpj");

      if (!error) setEmpresas(data || []);
      setLoading(false);
    };

    fetchEmpresas();
  }, []);
}
