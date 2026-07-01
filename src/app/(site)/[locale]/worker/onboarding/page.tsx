'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const TRADES = [
  'Construction',
  'Agriculture',
  'Landscaping',
  'Logistics & warehouse',
  'Cleaning & facilities',
  'Delivery & transport'
];

export default function WorkerOnboardingPage() {
  const t = useTranslations('worker');
  const { status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    countryOfOrigin: '',
    currentCountry: '',
    trade: TRADES[0],
    yearsOutdoorHeatExp: '0',
    languages: '',
    bioEn: '',
    availableFrom: '',
    expectedSalaryUsd: '',
    heatSafetyTrained: false,
    medicalClearance: false
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch('/api/workers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setSaving(false);
    if (res.ok) setSaved(true);
  }

  if (status === 'unauthenticated') {
    router.push('/en/sign-in');
    return null;
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-14">
      <h1 className="font-display text-2xl font-semibold text-night">{t('onboardingTitle')}</h1>
      <p className="mt-1.5 text-sm text-ink/60">{t('onboardingSub')}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('fullName')}>
            <input
              required
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('trade')}>
            <select
              value={form.trade}
              onChange={(e) => update('trade', e.target.value)}
              className="input"
            >
              {TRADES.map((tr) => (
                <option key={tr} value={tr}>
                  {tr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('countryOfOrigin')}>
            <input
              required
              value={form.countryOfOrigin}
              onChange={(e) => update('countryOfOrigin', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('currentCountry')}>
            <input
              required
              value={form.currentCountry}
              onChange={(e) => update('currentCountry', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('yearsHeatExp')}>
            <input
              type="number"
              min={0}
              value={form.yearsOutdoorHeatExp}
              onChange={(e) => update('yearsOutdoorHeatExp', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('expectedSalary')}>
            <input
              type="number"
              min={0}
              value={form.expectedSalaryUsd}
              onChange={(e) => update('expectedSalaryUsd', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('availableFrom')}>
            <input
              type="date"
              value={form.availableFrom}
              onChange={(e) => update('availableFrom', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('languages')}>
            <input
              placeholder="Arabic, English, Swahili"
              value={form.languages}
              onChange={(e) => update('languages', e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label={t('bio')}>
          <textarea
            rows={4}
            value={form.bioEn}
            onChange={(e) => update('bioEn', e.target.value)}
            className="input"
          />
        </Field>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={form.heatSafetyTrained}
              onChange={(e) => update('heatSafetyTrained', e.target.checked)}
              className="h-4 w-4 accent-ember"
            />
            {t('heatSafety')}
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={form.medicalClearance}
              onChange={(e) => update('medicalClearance', e.target.checked)}
              className="h-4 w-4 accent-ember"
            />
            {t('medicalClearance')}
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ember px-7 py-3 font-semibold text-white transition hover:bg-emberDeep disabled:opacity-60"
        >
          {t('saveProfile')}
        </button>
        {saved && <span className="ms-4 text-sm text-acacia">✓ Saved</span>}
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink/80">{label}</label>
      {children}
    </div>
  );
}
