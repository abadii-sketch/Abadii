'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const search = useSearchParams();
  const initialRole = search.get('role') === 'employer' ? 'EMPLOYER' : 'WORKER';

  const [role, setRole] = useState<'WORKER' | 'EMPLOYER'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong');
      setLoading(false);
      return;
    }

    const signInRes = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.ok) {
      router.push(
        role === 'WORKER' ? `/${locale}/worker/onboarding` : `/${locale}/employer/dashboard`
      );
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-display text-2xl font-semibold text-night">{t('signUpTitle')}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole('WORKER')}
          className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
            role === 'WORKER'
              ? 'border-ember bg-ember/10 text-emberDeep'
              : 'border-black/10 text-ink/60'
          }`}
        >
          {t('worker')}
        </button>
        <button
          type="button"
          onClick={() => setRole('EMPLOYER')}
          className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
            role === 'EMPLOYER'
              ? 'border-ember bg-ember/10 text-emberDeep'
              : 'border-black/10 text-ink/60'
          }`}
        >
          {t('employer')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/80">{t('email')}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/80">{t('password')}</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 outline-none focus:border-ember"
          />
        </div>

        {error && <p className="text-sm text-emberDeep">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ember py-3 font-semibold text-white transition hover:bg-emberDeep disabled:opacity-60"
        >
          {t('createAccount')}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        {t('haveAccount')}{' '}
        <a href={`/${locale}/sign-in`} className="font-medium text-emberDeep">
          {t('signInCta')}
        </a>
      </p>
    </main>
  );
}
