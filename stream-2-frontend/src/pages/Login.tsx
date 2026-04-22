import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const featureItems = [
  {
    title: 'Log workouts and meals',
    detail: 'Capture what you did in seconds with pre and post feeling context.',
  },
  {
    title: 'See personal patterns',
    detail: 'Find what improves mood, energy, and stress based on your own baseline.',
  },
  {
    title: 'Get daily insight prompts',
    detail: 'Receive practical suggestions you can test in your next session.',
  },
  {
    title: 'Track momentum over time',
    detail: 'Review trends weekly to stay consistent and avoid burnout patterns.',
  },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div className="auth-noise relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#d8f2e8_0,#f5fbf8_45%,#eef8ff_100%)] p-4 md:p-8">
      <div className="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl animate-float-slow" />

      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <section className="animate-rise px-2 lg:px-8">
          <div className="rounded-3xl border border-slate-200/80 bg-white/75 p-6 backdrop-blur md:p-8">
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              AI-powered fitness insights
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Understand your body patterns in minutes
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Turn your workouts, meals, and feelings into clear guidance so you can train smarter and recover better.
            </p>
            <button
              type="button"
              onClick={() => fillDemoCredentials('athena@example.com')}
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try it free
            </button>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200/80 bg-white/75 p-6 backdrop-blur md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Features and benefits</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {featureItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-slate-800">
            <p className="text-sm font-medium">Ready to build your own pattern engine?</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Create free account
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('cora@example.com')}
                className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
              >
                Explore demo
              </button>
            </div>
          </div>
        </section>

        <section className="animate-rise rounded-3xl border border-slate-200/70 bg-white/90 p-7 shadow-2xl backdrop-blur md:p-9">
          <div className="mb-7">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-600">Sign in to continue your momentum.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.16)]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.16)]"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Try demo accounts</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('athena@example.com')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Athena
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('boris@example.com')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Boris
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('cora@example.com')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Cora
              </button>
            </div>
          </div>

          <div className="mt-7 text-center text-sm text-slate-600">
            No account yet?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-semibold text-emerald-700 transition hover:text-emerald-600"
            >
              Create one
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
