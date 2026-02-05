import { useEffect, useState } from 'react';
import client from '../api/client';

export default function ExplorePage() {
  const [data, setData] = useState({ posts: [], reels: [] });

  useEffect(() => {
    client.get('/explore').then((res) => setData(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Trending Posts</h2>
        <div className="grid grid-cols-3 gap-2">
          {data.posts.map((post) => <img key={post._id} src={post.mediaUrl} className="aspect-square w-full object-cover" />)}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Trending Reels</h2>
        <div className="grid grid-cols-2 gap-2">
          {data.reels.map((reel) => <video key={reel._id} src={reel.videoUrl} className="h-44 w-full rounded object-cover" muted loop autoPlay />)}
        </div>
      </section>
    </div>
  );
}
