import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const SESSION_COOKIE = "session";

function secret() {
  return process.env.SESSION_SECRET || "dev-only-insecure-secret";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/** Signs a userId into a tamper-evident token: "<userId>.<hmac>" */
export function createSessionToken(userId: string) {
  const signature = crypto
    .createHmac("sha256", secret())
    .update(userId)
    .digest("hex");
  return `${userId}.${signature}`;
}

function verifySessionToken(token: string): string | null {
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return null;
  const expected = crypto
    .createHmac("sha256", secret())
    .update(userId)
    .digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return userId;
}

/** Reads the session cookie (server components / route handlers only). */
export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = verifySessionToken(token);
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const { password: _password, ...safeUser } = user;
  return safeUser;
}
