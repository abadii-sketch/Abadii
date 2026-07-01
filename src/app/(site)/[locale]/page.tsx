import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LogoMark } from '@/components/Logo';

export default async function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('landing');

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-sand">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-sun-arc opacity-60" />
        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sun/30 bg-sun/10 px-4 py-1.5 text-sm font-medium text-sunSoft">
            {t('eyebrow')}
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {t('headline')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-sand/75">{t('sub')}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}/sign-up?role=employer`}
              className="rounded-full bg-ember px-7 py-3.5 font-semibold text-white transition hover:bg-emberDeep"
            >
              {t('ctaEmployer')}
            </Link>
            <Link
              href={`/${locale}/sign-up?role=worker`}
              className="rounded-full border border-sand/25 px-7 py-3.5 font-semibold text-sand transition hover:bg-sand/10"
            >
              {t('ctaWorker')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-b border-black/5 bg-sandDim">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-6">
          <LogoMark className="h-10 w-10 shrink-0" />
          <p className="text-sm text-ink/70">{t('statHeat')}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="font-display text-2xl font-semibold text-night sm:text-3xl">
          {t('howItWorksTitle')}
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            { title: t('step1Title'), body: t('step1Body') },
            { title: t('step2Title'), body: t('step2Body') },
            { title: t('step3Title'), body: t('step3Body') }
          ].map((step, i) => (
            <div key={i} className="rounded-2xl border border-black/5 bg-white/60 p-6">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-sun/20 font-display text-sm font-semibold text-emberDeep">
                {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold text-night">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-night text-sand">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t('trustTitle')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sand/75">{t('trustBody')}</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-night">{t('footerCta')}</h2>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/sign-up?role=employer`}
            className="rounded-full bg-ember px-7 py-3.5 font-semibold text-white transition hover:bg-emberDeep"
          >
            {t('ctaEmployer')}
          </Link>
          <Link
            href={`/${locale}/sign-up?role=worker`}
            className="rounded-full border border-night/20 px-7 py-3.5 font-semibold text-night transition hover:bg-night/5"
          >
            {t('ctaWorker')}
          </Link>
        </div>
      </section>
    </main>
  );
}
