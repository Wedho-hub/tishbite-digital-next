"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 origin-left z-[200] pointer-events-none"
      style={{
        height: "3px",
        scaleX,
        background: "linear-gradient(90deg, #1b4332 0%, #2d6a4f 55%, #f4c95d 100%)",
      }}
    />
  );
}
