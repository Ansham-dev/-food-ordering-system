import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Not signed in." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json(user, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(req: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { name, phone, address } = body ?? {};

  const updated = await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
    },
  });

  const { password: _password, ...safeUser } = updated;
  return NextResponse.json(safeUser, {
    headers: { "Cache-Control": "no-store" },
  });
}
