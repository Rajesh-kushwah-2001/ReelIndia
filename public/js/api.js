export const api = {
  reels: (params="") => fetch(`/api/reels${params}`).then(r=>r.json()),
  like: (id) => fetch(`/api/reels/${id}/like`, {method:"POST"}).then(r=>r.json()),
  save: (id) => fetch(`/api/reels/${id}/save`, {method:"POST"}).then(r=>r.json()),
  comments: (id) => fetch(`/api/reels/${id}/comments`).then(r=>r.json()),
  upload: (form) => fetch(`/api/upload`, {method:"POST", body:form}).then(r=>r.json()),
  profile: (id) => fetch(`/api/users/${id}`).then(r=>r.json()),
  userUpsert: (u) => fetch(`/api/users`, {method:"POST", headers:{'Content-Type':'application/json'}, body:JSON.stringify(u)}).then(r=>r.json()),
  follow: (f) => fetch(`/api/follow`, {method:"POST", headers:{'Content-Type':'application/json'}, body:JSON.stringify(f)}).then(r=>r.json()),
  search: (q) => fetch(`/api/search?q=${encodeURIComponent(q)}`).then(r=>r.json()),
  sounds: () => fetch(`/api/sounds`).then(r=>r.json()),
  notifications: (uid) => fetch(`/api/notifications/${uid}`).then(r=>r.json()),
};
