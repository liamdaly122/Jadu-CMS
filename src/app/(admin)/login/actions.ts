"use server";

import { redirect } from "next/navigation";
import { signSession, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = formData.get("password");
  const next = (formData.get("next") as string) || "/admin";
  const expected = process.env.CMS_PASSWORD;

  if (!expected) {
    throw new Error("CMS_PASSWORD is not set");
  }

  if (typeof password !== "string" || password !== expected) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await signSession();
  await setSessionCookie(token);
  redirect(next);
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}
