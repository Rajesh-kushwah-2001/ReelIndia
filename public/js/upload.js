import { api } from "./api.js";
const el = id => document.getElementById(id);
const file = el("file"), caption = el("caption"), tags = el("tags"), soundSel = el("sound");
const status = el("status"), btn = el("btnUpload");

(async function init(){
  const sounds = await api.sounds();
  soundSel.innerHTML = `<option value="">None</option>` + sounds.map(s=>`<option value="${s.id}">${s.title}</option>`).join("");
})();

btn.onclick = async () => {
  if (!file.files[0]) return alert("Choose a video");
  const form = new FormData();
  form.append("video", file.files[0]);
  form.append("userId", "guest");
  form.append("caption", caption.value);
  form.append("tags", tags.value);
  form.append("sound", soundSel.value);
  status.textContent = "Uploading...";
  const res = await api.upload(form);
  if(res.success){ status.innerHTML = `Uploaded ✅ <a href="/public/pages/index.html">See feed</a>`; }
  else { status.textContent = "Upload failed"; }
};
