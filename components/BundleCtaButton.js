"use client";

export default function BundleCtaButton({ href, children }) {
  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <a className="btn btn-primary bundle-cta" href={href} onMouseMove={handleMouseMove}>
      {children}
    </a>
  );
}
