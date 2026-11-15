import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/course/jwt";

/** 受保护接口（教学用）：GET /api/me —— 校验 Authorization: Bearer <token> */

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) {
    return NextResponse.json(
      { error: "缺少 Token。请先登录，并在请求头携带 Authorization: Bearer <token>" },
      { status: 401 }
    );
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return NextResponse.json(
      { error: "Token 无效或已过期（签名校验失败 / 过期）" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    data: { sub: payload.sub, name: payload.name, exp: payload.exp },
    meta: { server: "course-api", protected: true },
  });
}
