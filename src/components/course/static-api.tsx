"use client";

import { useEffect } from "react";

/**
 * 注册 Service Worker（public/sw.js）：
 * - 纯静态托管（GitHub Pages / Cloudflare Pages / Netlify）下，由它托管实验沙箱
 *   并模拟教学接口，全部实验可完整运行；
 * - Node 服务器部署下，接口自动透传真实服务，行为不变；
 * - 注册失败（file:// 环境、旧浏览器）时静默跳过，走服务器接口。
 */
export function StaticApiBridge() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const proto = window.location.protocol;
    if (proto !== "https:" && proto !== "http:") return;
    const register = () => {
      const bp = window.location.pathname.replace(/\/[^/]*$/, "");
      navigator.serviceWorker.register(`${bp}/sw.js`).catch(() => {
        /* 无 SW 环境：自动回退到服务器接口 */
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
