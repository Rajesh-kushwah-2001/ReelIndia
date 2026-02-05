import { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');

  const save = async () => {
    const fd = new FormData();
    fd.append('bio', bio);
    const { data } = await client.patch('/users/profile/me', fd);
    setUser(data);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-900 p-4">
        <p className="text-lg font-semibold">@{user.username}</p>
        <p className="text-sm text-slate-400">{user.email}</p>
        <textarea className="mt-3 w-full rounded bg-slate-800 p-2" value={bio} onChange={(e) => setBio(e.target.value)} />
        <button className="mt-2 rounded bg-blue-600 px-3 py-2" onClick={save}>Save profile</button>
      </div>
      <button className="rounded bg-slate-800 px-3 py-2" onClick={logout}>Logout</button>
    </div>
  );
}
