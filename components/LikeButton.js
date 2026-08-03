"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function LikeButton({ slug, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked-${slug}`) === "1");
  }, [slug]);

  async function handleClick() {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    localStorage.setItem(`liked-${slug}`, "1");

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("increment_likes", { p_slug: slug });
    if (!error && typeof data === "number") {
      setLikes(data);
    }
  }

  return (
    <button
      type="button"
      className={`stats-overlay stat-likes like-button${liked ? " liked" : ""}`}
      onClick={handleClick}
      disabled={liked}
      aria-label={liked ? "Você já curtiu esse script" : "Curtir esse script"}
    >
      👍 {likes}
    </button>
  );
}
