"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

// Logo.jsx
export const Logo = ({ width = 200, height = 200 }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      className={`relative z-50`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={
          theme === "dark"
            ? "/assets/feedloop-dark.svg"
            : "/assets/feedloop-light.svg"
        }
        alt="FeedLoop Logo"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  );
};
