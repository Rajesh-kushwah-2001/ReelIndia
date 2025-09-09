const socket = io(); // same origin
let currentRoom = null;
let myName = "me";

const el = (id) => document.getElementById(id);
const messages = el("messages");
const sendBtn = el("sendBtn");
const nameInput = el("chatName");
const textInput = el("chatText");
const chatWith = el("chatWith");

function addMsg({ user, text, ts }) {
  const d = document.createElement("div");
  const cls = user === myName ? "me" : (user === "system" ? "system" : "other");
  d.className = `msg ${cls}`;
  d.textContent = user === "system" ? text : `${user}: ${text}`;
  d.title = new Date(ts || Date.now()).toLocaleString();
  messages.appendChild(d);
  messages.scrollTop = messages.scrollHeight;
}

function joinRoom(roomId, label) {
  messages.innerHTML = "";
  currentRoom = roomId;
  chatWith.textContent = `Chat — ${label}`;
  myName = nameInput.value.trim() || "me";
  socket.emit("chat:join", { roomId, user: myName });
}

document.querySelectorAll(".user-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const room = btn.getAttribute("data-room");
    joinRoom(room, btn.textContent.trim());
  });
});

sendBtn.addEventListener("click", () => {
  if (!currentRoom) return alert("Select a chat from left.");
  const txt = textInput.value.trim();
  if (!txt) return;
  socket.emit("chat:msg", { roomId: currentRoom, user: myName, text: txt });
  textInput.value = "";
});

textInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendBtn.click(); });

socket.on("chat:msg", (msg) => addMsg(msg));
