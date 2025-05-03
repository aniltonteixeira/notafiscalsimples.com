// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSupabaseEdgeClient } from "@/lib/supabase/edge";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseEdgeClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data } = await supabase
    .from("usuarios")
    .select("nivel_acesso_id")
    .eq("email", user.email)
    .single();

  const nivel = data?.nivel_acesso_id;
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && ![1, 2].includes(nivel)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (path.startsWith("/dashboard") && ![3, 4].includes(nivel)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
