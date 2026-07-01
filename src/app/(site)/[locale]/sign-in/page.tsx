'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError('Invalid email or password');
      return;
    }
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-display text-2xl font-semibold text-night">{t('signInTitle')}</h1>

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
          {t('signInCta')}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        {t('noAccount')}{' '}
        <a href={`/${locale}/sign-up`} className="font-medium text-emberDeep">
          {t('signUp') ?? 'Sign up'}
        </a>
      </p>
    </main>
  );
}
