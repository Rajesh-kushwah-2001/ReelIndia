import { api } from "./api.js";
const userId = "guest";

(async function(){
  await api.userUpsert({ id: userId, username: "guest", bio: "Hello from ReelIndia", avatar: ""});
  const u = await api.profile(userId);

  document.getElementById("username").textContent = `@${u.username}`;
  document.getElementById("followers").textContent = `${u.followers||0} followers`;
  document.getElementById("following").textContent = `${u.following||0} following`;
  document.getElementById("likes").textContent = `${u.totalLikes||0} likes`;
  document.getElementById("bio").textContent = u.bio || "";
  document.getElementById("avatar").src = u.avatar || "https://via.placeholder.com/72x72?text=RI";

  const grid = document.getElementById("grid");
  u.reels.forEach(r => {
    const v = document.createElement("video");
    v.src = r.src; v.muted = true; v.loop = true; v.playsInline = true;
    v.onmouseenter = ()=>v.play(); v.onmouseleave = ()=>v.pause();
    grid.appendChild(v);
  });
})();
