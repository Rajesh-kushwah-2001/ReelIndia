import { fetchReels } from "./api.js";
import { attachShareHandlers, shareVideo } from "./share.js";

const container = document.getElementById("reelsContainer");

function renderReel(r) {
  const wrap = document.createElement("div");
  wrap.className = "reel";
  wrap.innerHTML = `
    <video class="reel-video" src="${r.videoUrl}" muted playsinline loop preload="auto"></video>
    <div class="reel-info">
      <div class="user">@${r.username}</div>
      <div class="caption">${r.description}</div>
    </div>
    <div class="reel-actions">
      <button class="like">❤️ ${r.likes}</button>
      <button class="comment">💬</button>
      <button class="share">↗️</button>
    </div>
  `;
  const v = wrap.querySelector("video");
  v.addEventListener("error", () => {
    console.error("Video failed to load:", v.currentSrc);
  });

  wrap.querySelector(".share").addEventListener("click", () => {
    // Share the absolute URL to this video file
    const abs = `${location.origin}${r.videoUrl}`;
    shareVideo(abs);
  });

  return wrap;
}

function setupAutoplay() {
  const videos = Array.from(document.querySelectorAll(".reel-video"));
  let current = null;

  const playIt = (vid) => {
    if (current && current !== vid) current.pause();
    current = vid;
    vid.play().catch(() => {});
  };

  const io = new IntersectionObserver((entries) => {
    const best = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    entries.forEach(e => { if (!e.isIntersecting) e.target.pause(); });
    if (best) playIt(best.target);
  }, { threshold: [0.5, 0.7, 0.9] });

  videos.forEach(v => io.observe(v));

  // First user tap in case autoplay blocked
  const enableOnce = () => {
    const vis = videos.find(v => {
      const r = v.getBoundingClientRect();
      const h = innerHeight;
      const overlap = Math.max(0, Math.min(r.bottom, h) - Math.max(r.top, 0));
      return overlap / h > 0.5;
    });
    if (vis) playIt(vis);
    document.removeEventListener("click", enableOnce);
    document.removeEventListener("touchstart", enableOnce);
  };
  document.addEventListener("click", enableOnce, { passive: true });
  document.addEventListener("touchstart", enableOnce, { passive: true });
}

(async function init() {
  attachShareHandlers();

  const reels = await fetchReels();
  if (!reels.length) {
    container.innerHTML = `<div class="reel" style="display:flex;align-items:center;justify-content:center;">
      <div>No videos in <code>/uploads</code></div>
    </div>`;
    return;
  }

  reels.forEach(r => container.appendChild(renderReel(r)));
  setupAutoplay();
})();
