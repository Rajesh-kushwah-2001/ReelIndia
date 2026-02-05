import { useEffect, useState } from 'react';
import client from '../api/client';
import useSocket from '../hooks/useSocket';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const socket = useSocket(true);

  useEffect(() => {
    client.get(`/posts/feed/me?page=${page}&limit=5`).then(({ data }) => setPosts((prev) => [...prev, ...data]));
  }, [page]);

  useEffect(() => {
    const s = socket.current;
    if (!s) return;
    s.on('post:new', (post) => setPosts((prev) => [post, ...prev]));
    s.on('post:liked', ({ postId, likes }) => setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, likes: Array(likes).fill(0) } : p))));
    return () => {
      s.off('post:new');
      s.off('post:liked');
    };
  }, [socket]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post._id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="p-3 text-sm">@{post.author.username}</div>
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} className="max-h-[420px] w-full object-cover" />
          ) : (
            <video src={post.mediaUrl} controls className="max-h-[420px] w-full" />
          )}
          <div className="flex items-center justify-between p-3 text-sm text-slate-300">
            <p>{post.caption}</p>
            <button onClick={() => client.post(`/posts/${post._id}/like`)}>❤️ {post.likes.length}</button>
          </div>
        </article>
      ))}
      <button className="w-full rounded bg-slate-800 p-2" onClick={() => setPage((p) => p + 1)}>Load more</button>
    </div>
  );
}
