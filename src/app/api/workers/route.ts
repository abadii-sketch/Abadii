import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/workers?trade=Construction&country=Sudan&minExp=2
// Returns active worker profiles matching filters. Any signed-in employer can browse;
// plan-based limits (unlock caps) should be enforced when exposing contact details.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trade = searchParams.get('trade') || undefined;
  const country = searchParams.get('country') || undefined;
  const minExp = searchParams.get('minExp');

  const workers = await prisma.workerProfile.findMany({
    where: {
      active: true,
      ...(trade ? { trade: { equals: trade, mode: 'insensitive' } } : {}),
      ...(country ? { countryOfOrigin: { equals: country, mode: 'insensitive' } } : {}),
      ...(minExp ? { yearsOutdoorHeatExp: { gte: Number(minExp) } } : {})
    },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      fullName: true,
      countryOfOrigin: true,
      trade: true,
      yearsOutdoorHeatExp: true,
      languages: true,
      photoUrl: true,
      verificationStatus: true,
      heatSafetyTrained: true,
      availableFrom: true
    }
  });

  return NextResponse.json(workers);
}

// PUT /api/workers - update the signed-in worker's own profile
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'WORKER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const updated = await prisma.workerProfile.update({
    where: { userId: (session.user as any).id },
    data: {
      fullName: body.fullName,
      countryOfOrigin: body.countryOfOrigin,
      currentCountry: body.currentCountry,
      trade: body.trade,
      yearsOutdoorHeatExp: Number(body.yearsOutdoorHeatExp) || 0,
      languages: body.languages
        ? body.languages.split(',').map((l: string) => l.trim()).filter(Boolean)
        : [],
      bioEn: body.bioEn,
      availableFrom: body.availableFrom ? new Date(body.availableFrom) : null,
      expectedSalaryUsd: body.expectedSalaryUsd ? Number(body.expectedSalaryUsd) : null,
      heatSafetyTrained: Boolean(body.heatSafetyTrained),
      medicalClearance: Boolean(body.medicalClearance)
    }
  });

  return NextResponse.json(updated);
}
