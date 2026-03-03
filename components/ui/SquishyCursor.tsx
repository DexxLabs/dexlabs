"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

const SquishyCursor = () => {
  // Hide until first mousemove — prevents the dot flashing at 0,0 on load
  const [visible, setVisible] = useState(false);

  // Raw position → fed into springs
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Springs give the lag/trailing feel
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  // Velocity as motion values — no useState, no re-renders
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);

  // Rotation: direction of travel
  const rotation = useTransform([velocityX, velocityY], (latest: number[]) => {
    const [vx, vy] = latest;
    return Math.atan2(vy, vx) * (180 / Math.PI);
  });

  // Squish: fast vertical movement → compress X axis
  const scaleX = useTransform(velocityY, (vy) =>
    Math.max(1 - Math.abs(vy) * 0.16, 0.45)
  );

  // Squish: fast horizontal movement → compress Y axis
  const scaleY = useTransform(velocityX, (vx) =>
    Math.max(1 - Math.abs(vx) * 0.16, 0.45)
  );

  const lastPos = useRef({ x: -100, y: -100 });
  const lastTime = useRef(0);

  useEffect(() => {
    lastTime.current = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastTime.current;

      if (!visible) setVisible(true);

      if (dt > 0) {
        velocityX.set((e.clientX - lastPos.current.x) / dt);
        velocityY.set((e.clientY - lastPos.current.y) / dt);
      }

      rawX.set(e.clientX);
      rawY.set(e.clientY);

      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;
    };

    // Decay velocity to 0 smoothly when mouse is idle
    const decayInterval = setInterval(() => {
      velocityX.set(velocityX.get() * 0.85);
      velocityY.set(velocityY.get() * 0.85);
    }, 16);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(decayInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="fixed pointer-events-none max-lg:hidden"
      style={{
        // Drive position via left/top + springs — avoids the x/y+top:0/left:0 conflict
        left: springX,
        top: springY,
        // Offset so the centre of the dot sits on the cursor tip
        marginLeft: -10,
        marginTop: -10,
        rotate: rotation,
        scaleX,
        scaleY,
        zIndex: 99999,
        opacity: visible ? 1 : 0,
      }}
    >
      {/*
        bg-main-blue: make sure this is defined in your tailwind.config.ts.
        If not, replace with any color e.g. bg-white or bg-violet-500.
        Example config:
          theme: { extend: { colors: { 'main-blue': '#7C3AED' } } }
      */}
      <div className="size-5 rounded-full bg-main-blue" />
    </motion.div>
  );
};

export default SquishyCursor;