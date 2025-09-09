import { api } from "./api.js";
import { attachShareHandlers, openShare } from "./share.js";

const container = document.getElementById("reelsContainer");
attachShareHandlers();

let currentFeed = "forYou";
const currentUser = { id: "guest", username: "guest" };

document.getElementById("btnForYou").onclick = () => loadFeed("forYou");
document.getElementById("btnFollowing").onclick = () => loadFeed("following");

function card(r){
  const el = document.createElement("div");
  el.className = "reel";
  el.innerHTML = `
    <video class="reel-video" src="${r.src || r.videoUrl}" muted playsinline loop preload="auto"></video>
    <div class="reel-info">
      <div class="user">@${r.username}</div>
      <div class="caption">${r.caption || ""}</div>
    </div>
    <div class="reel-actions">
      <button class="like">❤️ ${r.likes||0}</button>
      <button class="comment">💬</button>
      <button class="save">🔖 ${r.saves||0}</button>
      <button class="share">↗️</button>
    </div>
  `;
  el.querySelector(".like").onclick = async () => {
    const res = await api.like(r.id); el.querySelector(".like").textContent = `❤️ ${res.likes}`;
  };
  el.querySelector(".save").onclick = async () => {
    const res = await api.save(r.id); el.querySelector(".save").textContent = `🔖 ${res.saves}`;
  };
  el.querySelector(".share").onclick = () => openShare(`${location.origin}${r.src || r.videoUrl}`);
  return el;
}

function autoplaySetup(){
  const vids = Array.from(document.querySelectorAll(".reel-video"));
  let current = null;
  const playIt = v => { if (current && current!==v) current.pause(); current=v; v.play().catch(()=>{}); };
  const io = new IntersectionObserver((entries)=>{
    const best = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio - a.intersectionRatio)[0];
    entries.forEach(e=>{ if (!e.isIntersecting) e.target.pause(); });
    if (best) playIt(best.target);
  }, { threshold:[0.5,0.7,0.9]});
  vids.forEach(v=>io.observe(v));
  const once=()=>{ const v=vids.find(Boolean); if(v) v.play().catch(()=>{}); document.removeEventListener("click", once); document.removeEventListener("touchstart", once); };
  document.addEventListener("click", once, { passive:true });
  document.addEventListener("touchstart", once, { passive:true });
}

async function loadFeed(feed){
  currentFeed = feed;
  const params = feed==="following" ? `?feed=following&userId=${currentUser.id}` : "";
  const list = await api.reels(params);
  container.innerHTML = "";
  list.forEach(r => container.appendChild(card(r)));
  autoplaySetup();
}
loadFeed("forYou");
