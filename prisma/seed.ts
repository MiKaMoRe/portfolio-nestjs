import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const profileData = {
  name: 'Alex Morgan',
  description:
    'Backend developer focused on Node.js, GraphQL and PostgreSQL.' +
    'Enjoys designing clean APIs and making slow queries fast.',
};

const skillsData: string[] = [
  'TypeScript',
  'NestJS',
  'GraphQL',
  'PostgreSQL',
  'Prisma',
  'Docker',
  'Vitest',
];

const experienceData: { company: string; position: string }[] = [
  { company: 'Acme Corp', position: 'Senior Backend Developer' },
  { company: 'Globex', position: 'Backend Developer' },
  { company: 'Initech', position: 'Junior Developer' },
];

const projectsData: string[] = [
  'NestJS Library',
  'GraphQL Portfolio API',
  'DataLoader Registry',
  'Telegram Reminder Bot',
];

async function main() {
  await prisma.skill.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.projects.deleteMany({});
  await prisma.profile.deleteMany({});

  const profile = await prisma.profile.create({ data: profileData });
  console.log('Profile created', { id: profile.id, name: profile.name });

  await prisma.skill.createMany({
    data: skillsData.map((name) => ({ name, profileId: profile.id })),
  });

  await prisma.experience.createMany({
    data: experienceData.map(({ company, position }) => ({
      company,
      position,
      profileId: profile.id,
    })),
  });

  await prisma.projects.createMany({
    data: projectsData.map((name) => ({ name, profileId: profile.id })),
  });

  console.log('Seed finished', {
    skills: skillsData.length,
    experience: experienceData.length,
    projects: projectsData.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
