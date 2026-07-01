import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SKILLS: Array<{ nameEn: string; nameAr: string }> = [
  { nameEn: 'Masonry', nameAr: 'بناء' },
  { nameEn: 'Rebar & concrete', nameAr: 'حديد وخرسانة' },
  { nameEn: 'Scaffolding', nameAr: 'سقالات' },
  { nameEn: 'Irrigation', nameAr: 'ري' },
  { nameEn: 'Harvesting', nameAr: 'حصاد' },
  { nameEn: 'Forklift operation', nameAr: 'تشغيل رافعة شوكية' },
  { nameEn: 'Landscaping & groundskeeping', nameAr: 'تنسيق حدائق' },
  { nameEn: 'General labour', nameAr: 'عمالة عامة' }
];

async function main() {
  for (const skill of SKILLS) {
    await prisma.skill.upsert({
      where: { nameEn: skill.nameEn },
      update: {},
      create: skill
    });
  }

  const demoPassword = await bcrypt.hash('password123', 10);

  const worker = await prisma.user.upsert({
    where: { email: 'worker.demo@abadii.app' },
    update: {},
    create: {
      email: 'worker.demo@abadii.app',
      passwordHash: demoPassword,
      role: 'WORKER',
      workerProfile: {
        create: {
          fullName: 'Amadi Okoye',
          countryOfOrigin: 'Nigeria',
          currentCountry: 'Nigeria',
          trade: 'Construction',
          yearsOutdoorHeatExp: 6,
          languages: ['English', 'Igbo'],
          bioEn:
            'Six years on outdoor construction sites across Lagos and Abuja. Comfortable working full shifts in high heat and humidity.',
          heatSafetyTrained: true,
          medicalClearance: true,
          verificationStatus: 'VERIFIED'
        }
      }
    }
  });

  const employer = await prisma.user.upsert({
    where: { email: 'employer.demo@abadii.app' },
    update: {},
    create: {
      email: 'employer.demo@abadii.app',
      passwordHash: demoPassword,
      role: 'EMPLOYER',
      employerProfile: {
        create: {
          companyName: 'Desert Build Contracting',
          country: 'United Arab Emirates',
          industry: 'Construction',
          verificationStatus: 'VERIFIED'
        }
      }
    }
  });

  console.log('Seeded skills + demo accounts:', {
    worker: worker.email,
    employer: employer.email,
    password: 'password123'
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
