import { api } from "./api.js";
const q = document.getElementById("q");
const usersEl = document.getElementById("users");
const grid = document.getElementById("grid");

async function run(){
  const res = await api.search(q.value);
  usersEl.innerHTML = res.users.map(u=>`<div>@${u.username}</div>`).join("") || "<div>No users</div>";
  grid.innerHTML = "";
  res.reels.forEach(r=>{
    const v = document.createElement("video");
    v.src = r.src || r.videoUrl; v.muted = true; v.loop = true; v.playsInline = true;
    v.onmouseenter = ()=>v.play(); v.onmouseleave = ()=>v.pause();
    grid.appendChild(v);
  });
}
q.addEventListener("input", () => run());
run();
