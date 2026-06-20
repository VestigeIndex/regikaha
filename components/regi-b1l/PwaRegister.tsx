"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/regi-b1l-sw.js", { scope: "/regi-b1l" });
    }
  }, []);
  return null;
}
