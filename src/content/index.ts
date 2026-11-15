import type { ComponentType } from "react";
import { Chapter1 } from "./chapter-1";
import { Chapter2 } from "./chapter-2";
import { Chapter3 } from "./chapter-3";
import { Chapter4 } from "./chapter-4";
import { Chapter5 } from "./chapter-5";
import { Chapter6 } from "./chapter-6";
import { Chapter7 } from "./chapter-7";
import { Chapter8 } from "./chapter-8";
import { Chapter9 } from "./chapter-9";
import { Chapter10 } from "./chapter-10";
import { Chapter11 } from "./chapter-11";
import { Chapter12 } from "./chapter-12";
import { Project1 } from "./project-1";
import { Project2 } from "./project-2";
import { Project3 } from "./project-3";
import { Project4 } from "./project-4";
import { Project5 } from "./project-5";
import { Land1 } from "./land-1";
import { Land2 } from "./land-2";
import { Land3 } from "./land-3";
import { AppendixA } from "./appendix-a";
import { AppendixB } from "./appendix-b";
import { AppendixC } from "./appendix-c";

/** slug → 正文组件（含项目复盘、落地页与附录） */
export const CONTENT: Record<string, ComponentType> = {
  ch1: Chapter1,
  ch2: Chapter2,
  ch3: Chapter3,
  ch4: Chapter4,
  ch5: Chapter5,
  ch6: Chapter6,
  ch7: Chapter7,
  ch8: Chapter8,
  ch9: Chapter9,
  ch10: Chapter10,
  ch11: Chapter11,
  ch12: Chapter12,
  p1: Project1,
  p2: Project2,
  p3: Project3,
  p4: Project4,
  p5: Project5,
  land1: Land1,
  land2: Land2,
  land3: Land3,
  "ax-a": AppendixA,
  "ax-b": AppendixB,
  "ax-c": AppendixC,
};
