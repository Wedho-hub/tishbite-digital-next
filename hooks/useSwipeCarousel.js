"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, InertiaPlugin);
}

// Drag/swipe-to-scroll carousel shared by Testimonials and Projects.
// containerRef wraps the visible, overflow-hidden viewport; trackRef is the
// flex row of equal-width, shrink-0 cards that gets dragged horizontally.
export function useSwipeCarousel(itemCount) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const draggableRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(itemCount > 1);

  const getStep = useCallback(() => {
    const track = trackRef.current;
    const firstCard = track?.children?.[0];
    if (!track || !firstCard) return 0;
    const gap = parseFloat(window.getComputedStyle(track).columnGap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !containerRef.current || itemCount < 1) return;

    const updateActive = () => {
      const step = getStep();
      const instance = draggableRef.current;
      if (!instance || !step) return;
      const idx = Math.round(-instance.x / step);
      setActiveIndex(Math.max(0, Math.min(itemCount - 1, idx)));
      setCanPrev(instance.x < instance.maxX - 1);
      setCanNext(instance.x > instance.minX + 1);
    };

    const [instance] = Draggable.create(track, {
      type: "x",
      bounds: containerRef.current,
      inertia: true,
      edgeResistance: 0.75,
      dragClickables: true,
      snap: { x: (value) => (getStep() ? Math.round(value / getStep()) * getStep() : value) },
      onDrag: updateActive,
      onThrowUpdate: updateActive,
      onRelease: updateActive,
    });
    draggableRef.current = instance;
    updateActive();

    const onResize = () => {
      instance.applyBounds(containerRef.current);
      updateActive();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      instance.kill();
    };
  }, [itemCount, getStep]);

  const goTo = useCallback(
    (index) => {
      const instance = draggableRef.current;
      const track = trackRef.current;
      const step = getStep();
      if (!instance || !track || !step) return;
      const clamped = Math.max(0, Math.min(itemCount - 1, index));
      const targetX = Math.max(instance.minX, Math.min(instance.maxX, -clamped * step));
      gsap.to(track, {
        x: targetX,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => instance.update(),
        onComplete: () => {
          setActiveIndex(clamped);
          setCanPrev(instance.x < instance.maxX - 1);
          setCanNext(instance.x > instance.minX + 1);
        },
      });
    },
    [getStep, itemCount]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  return { containerRef, trackRef, activeIndex, goTo, next, prev, canPrev, canNext };
}
