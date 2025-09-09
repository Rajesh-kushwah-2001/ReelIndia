const local = document.getElementById("local");
document.getElementById("btnStart").onclick = async () => {
  const s = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
  local.srcObject = s;
  // TODO: Add Socket.IO signaling for real viewers
};
