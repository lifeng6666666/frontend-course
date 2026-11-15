import { createHmac } from "crypto";

/**
 * 课程演示用的 JWT 签发与校验（HS256）。
 * SECRET 仅用于教学演示，真实项目必须从环境变量读取并妥善保管。
 */
const SECRET = "course-demo-secret-do-not-use-in-production";

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function signJwt(payload: Record<string, unknown>, expiresInSeconds = 3600): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));
  const sig = createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

export function verifyJwt(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url");
  if (sig !== expected) return null; // 签名对不上 = 被伪造或篡改
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      exp?: number;
    };
    if (payload.exp && payload.exp * 1000 < Date.now()) return null; // 过期
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}
