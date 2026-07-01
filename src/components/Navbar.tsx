'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import Logo from './Logo';

export default function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('nav');
  const locale = useLocale();
  const otherLocale = locale === 'en' ? 'ar' : 'en';

  const role = (session?.user as any)?.role as string | undefined;
  const dashboardHref =
    role === 'EMPLOYER' ? `/${locale}/employer/dashboard` : `/${locale}/worker/onboarding`;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href={`/${locale}`}>
          <Logo />
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-night/80">
          <Link
            href={`/${locale === 'en' ? 'en' : 'ar'}`}
            className="hidden sm:inline hover:text-night"
          >
            {t('forEmployers')}
          </Link>
          <Link href={otherLocale === 'ar' ? '/ar' : '/en'} className="hover:text-night">
            {otherLocale === 'ar' ? 'ع' : 'EN'}
          </Link>
          {session ? (
            <>
              <Link
                href={dashboardHref}
                className="hover:text-night"
              >
                {t('dashboard')}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="rounded-full bg-night px-4 py-2 text-sand transition hover:bg-nightSoft"
              >
                {t('signIn') === 'Sign in' ? 'Sign out' : 'خروج'}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/sign-in`} className="hover:text-night">
                {t('signIn')}
              </Link>
              <Link
                href={`/${locale}/sign-up`}
                className="rounded-full bg-ember px-4 py-2 text-white transition hover:bg-emberDeep"
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
