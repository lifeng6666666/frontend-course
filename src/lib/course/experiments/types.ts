export type StepMode = "html" | "react" | "tailwind";

export interface ExperimentStep {
  id: string;
  label: string;
  /** 该步骤的引导说明，显示在步骤切换条下方 */
  brief: string;
  /** html 模式为完整 HTML 文档；react/tailwind 模式为 JSX 组件代码 */
  code: string;
  /** 覆盖实验级默认模式的步骤级模式 */
  mode?: StepMode;
}

export interface ExperimentFile {
  name: string;
  content: string;
}

export interface Experiment {
  id: string;
  /** 展示在实验区标题旁的短徽标 */
  badge: string;
  title: string;
  intro: string;
  tasks: string[];
  steps: ExperimentStep[];
  /** 「下载本章代码」按钮打包的文件 */
  files: ExperimentFile[];
  readme?: string;
  /** 默认运行模式：html=完整文档；react/tailwind=浏览器内转译的 JSX */
  mode?: StepMode;
  /** 显示控制台面板（捕获 iframe 内 console 输出与报错） */
  console?: boolean;
  /** 显示网络面板（捕获 iframe 内 fetch 请求：方法/状态码/耗时） */
  net?: boolean;
  /** 显示响应式宽度控制（375/640/820/100%） */
  widthCtl?: boolean;
  /** 预览窗格高度（像素），默认 460 */
  height?: number;
}
