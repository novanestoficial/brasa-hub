"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    if (sessionStorage.getItem("visited")) return;
    sessionStorage.setItem("visited", "1");
    fetch("/api/track-visit", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
