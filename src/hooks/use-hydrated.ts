"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * 客户端水合检测：服务端渲染返回 false，客户端返回 true。
 * 用于仅在客户端渲染的组件（如 CodeMirror 编辑器）与依赖主题状态的 UI。
 */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
