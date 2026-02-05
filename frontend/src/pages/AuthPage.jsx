import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form, mode === 'login' ? 'login' : 'signup');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Auth failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
      <form className="w-full max-w-sm space-y-3 rounded-2xl bg-slate-900 p-6" onSubmit={submit}>
        <h1 className="text-2xl font-bold">YouPlay</h1>
        {mode === 'signup' && <input className="w-full rounded bg-slate-800 p-2" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />}
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full rounded bg-blue-600 p-2 font-semibold">{mode === 'login' ? 'Login' : 'Sign up'}</button>
        <button type="button" className="w-full text-sm text-slate-400" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Create account' : 'Already have an account?'}
        </button>
      </form>
    </div>
  );
}
