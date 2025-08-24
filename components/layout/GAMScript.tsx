"use client";
import Script from "next/script";
import { initializeGAM } from "@/lib/config/gam";

export default function GAMScript() {
  return (
    <Script
      src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined") {
          initializeGAM();
        }
      }}
    />
  );
}
