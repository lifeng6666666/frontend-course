import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/course/jwt";

/** 登录接口（教学用）：POST /api/auth/login —— 签发 JWT */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  await sleep(200 + Math.random() * 150);
  const body = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  // 教学演示账号，真实项目里应查数据库并对密码做哈希比对（如 bcrypt）
  if (body.username !== "demo" || body.password !== "demo123") {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  const token = signJwt({ sub: "demo", name: "课程学员" }, 3600);
  return NextResponse.json({
    token,
    tokenType: "Bearer",
    expiresIn: 3600,
  });
}
