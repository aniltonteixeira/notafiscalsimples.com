'use client';

import { useState } from "react";
import { AuthService } from "@/modules/auth/auth-service";
import { SupabaseAuthRepository } from "@/modules/auth/supabase-auth-repository";
import { redirect } from "next/navigation";

const authService = new AuthService(new SupabaseAuthRepository());

export default function Home() {
  redirect("/login");
}