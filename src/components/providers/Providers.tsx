"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { QuoteProvider } from "./QuoteProvider";
import { SmoothScroll } from "./SmoothScroll";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      <ThemeProvider>
        <SmoothScroll>
          <QuoteProvider>{children}</QuoteProvider>
        </SmoothScroll>
      </ThemeProvider>
    </MotionConfig>
  );
}
