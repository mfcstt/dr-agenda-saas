"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/src/db";
import { clinicsTable, usersToClinicsTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";

export const createClinic = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }
  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();
  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });
  redirect("/dashboard");
};
