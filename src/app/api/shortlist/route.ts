import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const FREE_PLAN_MONTHLY_UNLOCKS = 5;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { workerId } = await req.json();
  if (!workerId) {
    return NextResponse.json({ error: 'workerId required' }, { status: 400 });
  }

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: (session.user as any).id }
  });
  if (!employer) return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });

  // Reset monthly unlock counter if the reset window has passed.
  const now = new Date();
  const monthMs = 30 * 24 * 60 * 60 * 1000;
  let unlocksUsed = employer.profileUnlocksUsed;
  if (now.getTime() - employer.profileUnlocksReset.getTime() > monthMs) {
    unlocksUsed = 0;
  }

  const alreadyShortlisted = await prisma.shortlist.findUnique({
    where: { employerId_workerId: { employerId: employer.id, workerId } }
  });

  if (!alreadyShortlisted && employer.plan === 'FREE' && unlocksUsed >= FREE_PLAN_MONTHLY_UNLOCKS) {
    return NextResponse.json(
      { error: 'Free plan limit reached. Upgrade to shortlist more workers this month.' },
      { status: 402 }
    );
  }

  const shortlist = await prisma.shortlist.upsert({
    where: { employerId_workerId: { employerId: employer.id, workerId } },
    update: {},
    create: { employerId: employer.id, workerId }
  });

  if (!alreadyShortlisted) {
    await prisma.employerProfile.update({
      where: { id: employer.id },
      data: {
        profileUnlocksUsed: unlocksUsed + 1,
        profileUnlocksReset: unlocksUsed === 0 ? now : employer.profileUnlocksReset
      }
    });
  }

  return NextResponse.json(shortlist, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const employer = await prisma.employerProfile.findUnique({
    where: { userId: (session.user as any).id }
  });
  if (!employer) return NextResponse.json([]);

  const shortlists = await prisma.shortlist.findMany({
    where: { employerId: employer.id },
    include: { worker: true }
  });

  return NextResponse.json(shortlists);
}
