import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Feed'],
  ['/reels', 'Reels'],
  ['/explore', 'Explore'],
  ['/notifications', 'Notifications'],
  ['/profile', 'Profile']
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold">YouPlay</h1>
      </header>
      <main className="mx-auto max-w-3xl p-4 pb-20">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-slate-800 bg-slate-900 p-3 text-sm">
        {links.map(([to, name]) => (
          <NavLink key={to} to={to} className="text-slate-300 [&.active]:text-white">
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
