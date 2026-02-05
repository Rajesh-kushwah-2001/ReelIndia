import { useEffect, useState } from 'react';
import client from '../api/client';
import useSocket from '../hooks/useSocket';

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const socket = useSocket(true);

  useEffect(() => {
    client.get('/reels/feed?limit=20').then(({ data }) => setReels(data));
  }, []);

  useEffect(() => {
    const s = socket.current;
    if (!s) return;
    s.on('reel:liked', ({ reelId, likes }) => setReels((prev) => prev.map((r) => (r._id === reelId ? { ...r, likes: Array(likes).fill(0) } : r))));
    s.on('reel:viewed', ({ reelId, views }) => setReels((prev) => prev.map((r) => (r._id === reelId ? { ...r, views } : r))));
    return () => {
      s.off('reel:liked');
      s.off('reel:viewed');
    };
  }, [socket]);

  return (
    <div className="space-y-4">
      {reels.map((reel) => (
        <section key={reel._id} className="relative h-[80vh] overflow-hidden rounded-2xl bg-black">
          <video src={reel.videoUrl} className="h-full w-full object-cover" autoPlay muted loop playsInline onPlay={() => client.post(`/reels/${reel._id}/view`)} />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="font-semibold">@{reel.author.username}</p>
            <p>{reel.caption}</p>
            <div className="mt-2 flex gap-4 text-sm">
              <button onClick={() => client.post(`/reels/${reel._id}/like`)}>❤️ {reel.likes.length}</button>
              <span>👁️ {reel.views}</span>
              <button onClick={() => client.post(`/users/follow/${reel.author._id}`)}>Follow</button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
