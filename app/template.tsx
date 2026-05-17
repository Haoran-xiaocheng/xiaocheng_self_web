"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/* Next.js App Router's template.tsx remounts on every navigation
   (unlike layout.tsx which persists), so a Framer Motion enter
   animation hung off it produces a soft cross-fade between pages.

   We deliberately animate opacity ONLY. `transform` and `filter`
   on a parent create a new containing block for `position: fixed`
   children, which would break BlogDrum (it relies on `fixed inset-0`
   to anchor the drum to the viewport). Opacity has no such effect.

   The key needs to be coarser than `pathname`: when BlogDrum calls
   `history.pushState` to update the URL on card open/close, Next.js
   updates `usePathname()` even though no real route change happened.
   If we used `key={pathname}` directly, that would remount BlogDrum
   and wipe its state (active index, opened slug) on every card open,
   producing the "ESC always lands on the first card" bug. So we
   collapse `/blog`, `/blog/`, and `/blog/<slug>` to one stable key. */

function sectionKey(pathname: string): string {
  if (pathname.startsWith("/blog")) return "/blog";
  return pathname;
}

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={sectionKey(pathname)}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
