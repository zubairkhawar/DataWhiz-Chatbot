"use client";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import type { Engine } from "@tsparticles/engine";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Particle config
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);
  return (
    <>
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-futuristic-gradient opacity-80" />
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            particles: {
              number: { value: 60, density: { enable: true, value_area: 800 } },
              color: { value: ["#8B5CF6", "#22D3EE", "#9333EA"] },
              shape: { type: "circle" },
              opacity: { value: 0.15 },
              size: { value: 2, random: true },
              move: { enable: true, speed: 0.6, direction: "none", random: false, straight: false, out_mode: "out" },
              links: { enable: true, color: "#9333EA", opacity: 0.1, width: 1 },
            },
            detectRetina: true,
          }}
          className="w-full h-full"
        />
      </div>
      {children}
    </>
  );
} 