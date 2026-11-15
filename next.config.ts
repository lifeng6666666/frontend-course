import type { NextConfig } from "next";

/**
 * 两种构建模式：
 * - 默认（standalone）：Node 服务器部署，API 路由真实运行；
 * - STATIC_EXPORT=1：纯静态导出（产物在 out/），配合 public/sw.js 的浏览器内置
 *   兼容层，可部署到 GitHub Pages / Cloudflare Pages / Netlify 等纯静态托管。
 * - NEXT_PUBLIC_BASE_PATH：子路径部署（如 GitHub Pages 项目页 /仓库名/）时设置。
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const common: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

const nextConfig: NextConfig = isStaticExport
  ? {
      ...common,
      output: "export",
      basePath,
      images: { unoptimized: true },
      // 静态导出无需 API 路由（由 public/sw.js 接管），排除 .ts 形式的 route 处理器
      pageExtensions: ["tsx", "jsx"],
    }
  : {
      ...common,
      output: "standalone",
    };

export default nextConfig;
