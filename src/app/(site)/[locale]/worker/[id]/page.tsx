import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function WorkerProfilePage({ params }: { params: { id: string } }) {
  const worker = await prisma.workerProfile.findUnique({ where: { id: params.id } });
  if (!worker) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 py-14">
      <div className="rounded-2xl border border-black/5 bg-white p-7">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-night">{worker.fullName}</h1>
            <p className="text-ink/60">{worker.trade}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              worker.verificationStatus === 'VERIFIED'
                ? 'bg-acacia/15 text-acacia'
                : 'bg-black/5 text-ink/50'
            }`}
          >
            {worker.verificationStatus}
          </span>
        </div>

        {worker.bioEn && <p className="mt-4 text-sm leading-relaxed text-ink/75">{worker.bioEn}</p>}

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <Detail label="Country of origin" value={worker.countryOfOrigin} />
          <Detail label="Current country" value={worker.currentCountry} />
          <Detail label="Heat-work experience" value={`${worker.yearsOutdoorHeatExp} years`} />
          <Detail label="Languages" value={worker.languages.join(', ') || '—'} />
          <Detail
            label="Heat-safety trained"
            value={worker.heatSafetyTrained ? 'Yes' : 'Not yet'}
          />
          <Detail
            label="Medical clearance"
            value={worker.medicalClearance ? 'On file' : 'Not on file'}
          />
        </dl>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value || '—'}</dd>
    </div>
  );
}
