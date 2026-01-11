import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ferryData = [
  {
    id: 'DF001',
    operator: 'BlueWave Ferries',
    ship: 'MV Horizon',
    from: 'GBDOV',
    to: 'FRCAL',
    departure: new Date('2025-06-01T07:20:00Z'),
    arrival: new Date('2025-06-01T09:00:00Z'),
    durationMins: 100,
    price: 42.5,
  },
  {
    id: 'DF002',
    operator: 'BlueWave Ferries',
    ship: 'MV Horizon',
    from: 'GBDOV',
    to: 'FRCAL',
    departure: new Date('2025-06-01T10:10:00Z'),
    arrival: new Date('2025-06-01T11:50:00Z'),
    durationMins: 100,
    price: 39.99,
  },
  {
    id: 'DF003',
    operator: 'ChannelLine',
    ship: 'CL Spirit',
    from: 'GBDOV',
    to: 'FRDUN',
    departure: new Date('2025-06-01T08:00:00Z'),
    arrival: new Date('2025-06-01T11:30:00Z'),
    durationMins: 210,
    price: 55.0,
  },
  {
    id: 'DF004',
    operator: 'ChannelLine',
    ship: 'CL Spirit',
    from: 'GBPLY',
    to: 'FRROS',
    departure: new Date('2025-06-01T18:30:00Z'),
    arrival: new Date('2025-06-01T23:45:00Z'),
    durationMins: 315,
    price: 72.0,
  },
];

async function main() {
  console.log('Seeding ferry data...');

  for (const ferry of ferryData) {
    await prisma.ferry.upsert({
      where: { id: ferry.id },
      update: ferry,
      create: ferry,
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
