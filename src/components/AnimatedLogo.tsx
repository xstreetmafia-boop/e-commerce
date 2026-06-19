"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function AnimatedLogo({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (containerRef.current && !hasAnimated.current) {
      hasAnimated.current = true;
      
      const letters = containerRef.current.querySelectorAll(".letter");
      
      // Drop animation - letters fall from above with bounce
      animate(letters, {
        translateY: [-200, 0],
        opacity: [0, 1],
        scale: [0.3, 1],
        rotate: [-15, 0],
        ease: "outBounce",
        duration: 1200,
        delay: stagger(120),
      });

      // Animate the dot with elastic bounce
      const dot = containerRef.current.querySelector(".dot");
      if (dot) {
        animate(dot, {
          translateY: [-250, 0],
          opacity: [0, 1],
          scale: [0, 1.3, 1],
          ease: "outElastic(1, 0.5)",
          duration: 1800,
          delay: 700,
        });
      }
    }
  }, []);

  return (
    <div className={`${className}`}>
      <div
        ref={containerRef}
        className="flex items-end justify-center gap-1 md:gap-2"
        style={{ fontFamily: "var(--font-unbounded), sans-serif" }}
      >
        {["D", "E", "M", "O"].map((letter, index) => (
          <span
            key={index}
            className="letter text-5xl sm:text-7xl md:text-8xl lg:text-[12rem] font-black text-green-500 opacity-0"
            style={{
              textShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
              fontFamily: "var(--font-unbounded), sans-serif",
              fontWeight: 900,
            }}
          >
            {letter}
          </span>
        ))}
        <span
          className="dot text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-green-500 opacity-0 mb-1 sm:mb-2 md:mb-4"
          style={{
            textShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
            fontFamily: "var(--font-unbounded), sans-serif",
            fontWeight: 900,
          }}
        >
          .
        </span>
      </div>
    </div>
  );
}
