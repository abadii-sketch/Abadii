'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Worker = {
  id: string;
  fullName: string;
  countryOfOrigin: string;
  trade: string;
  yearsOutdoorHeatExp: number;
  languages: string[];
  verificationStatus: string;
  heatSafetyTrained: boolean;
};

export default function EmployerDashboardPage() {
  const t = useTranslations('employer');
  const tc = useTranslations('common');

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [trade, setTrade] = useState('');
  const [country, setCountry] = useState('');
  const [minExp, setMinExp] = useState('');
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  async function loadWorkers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (trade) params.set('trade', trade);
    if (country) params.set('country', country);
    if (minExp) params.set('minExp', minExp);

    const res = await fetch(`/api/workers?${params.toString()}`);
    const data = await res.json();
    setWorkers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleShortlist(workerId: string) {
    const res = await fetch('/api/shortlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId })
    });

    if (res.status === 402) {
      const data = await res.json();
      setNotice(data.error);
      return;
    }

    if (res.ok) {
      setShortlisted((s) => new Set(s).add(workerId));
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-2xl font-semibold text-night">{t('dashboardTitle')}</h1>

      <div className="mt-2 inline-block rounded-full bg-sun/15 px-3.5 py-1.5 text-xs font-medium text-emberDeep">
        {t('planFree')}
      </div>

      {notice && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-emberDeep">
          <span>{notice}</span>
          <button className="font-semibold underline">{t('upgrade')}</button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loadWorkers();
        }}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white/60 p-4"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">{t('filterTrade')}</label>
          <input
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            placeholder="Construction"
            className="input w-44"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">
            {t('filterCountry')}
          </label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Sudan"
            className="input w-44"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">
            {t('filterMinExp')}
          </label>
          <input
            type="number"
            min={0}
            value={minExp}
            onChange={(e) => setMinExp(e.target.value)}
            className="input w-28"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-night px-6 py-2.5 text-sm font-semibold text-sand transition hover:bg-nightSoft"
        >
          {t('search')}
        </button>
      </form>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workers.map((w) => (
          <div key={w.id} className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-night">{w.fullName}</h3>
                <p className="text-sm text-ink/60">{w.trade}</p>
              </div>
              {w.verificationStatus === 'VERIFIED' ? (
                <span className="rounded-full bg-acacia/15 px-2.5 py-1 text-xs font-medium text-acacia">
                  {tc('verified')}
                </span>
              ) : (
                <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-ink/50">
                  {tc('unverified')}
                </span>
              )}
            </div>

            <dl className="mt-4 space-y-1.5 text-sm text-ink/70">
              <div className="flex justify-between">
                <dt>Origin</dt>
                <dd className="font-medium text-ink">{w.countryOfOrigin || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Heat experience</dt>
                <dd className="font-medium text-ink">
                  {w.yearsOutdoorHeatExp} {tc('years')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Languages</dt>
                <dd className="font-medium text-ink">{w.languages.join(', ') || '—'}</dd>
              </div>
            </dl>

            <button
              onClick={() => handleShortlist(w.id)}
              disabled={shortlisted.has(w.id)}
              className="mt-4 w-full rounded-full border border-ember px-4 py-2 text-sm font-semibold text-emberDeep transition hover:bg-ember/10 disabled:border-acacia disabled:text-acacia"
            >
              {shortlisted.has(w.id) ? t('shortlisted') : t('shortlist')}
            </button>
          </div>
        ))}
      </div>

      {!loading && workers.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink/50">{t('noResults')}</p>
      )}
    </main>
  );
}
