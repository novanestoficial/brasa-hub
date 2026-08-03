"use client";

import { useEffect } from "react";

export default function Embers() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const field = document.getElementById("embers");
    if (!field) return;

    const MAX = 26;
    const spawned = [];

    function spawnEmber() {
      const el = document.createElement("div");
      el.className = "ember-particle";
      const size = (Math.random() * 3 + 2).toFixed(1) + "px";
      const duration = (Math.random() * 8 + 7).toFixed(2) + "s";
      const delay = (Math.random() * 4).toFixed(2) + "s";
      const drift = (Math.random() * 120 - 60).toFixed(0) + "px";
      const x = (Math.random() * 100).toFixed(2) + "%";
      el.style.setProperty("--size", size);
      el.style.setProperty("--duration", duration);
      el.style.setProperty("--delay", delay);
      el.style.setProperty("--drift", drift);
      el.style.setProperty("--x", x);
      field.appendChild(el);
      spawned.push(el);
    }

    for (let i = 0; i < MAX; i++) spawnEmber();

    return () => {
      spawned.forEach((el) => el.remove());
    };
  }, []);

  return null;
}
