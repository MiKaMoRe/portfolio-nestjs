import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const description = [
  'Backend-разработчик с 2+ годами коммерческого опыта. Основной стек - Go. Работал с разными стеками технологий. От Ruby on Rails, до Python FastAPI',
  'Работал над проектами в сфере облачной инфраструктуры, виртуализации, VoIP-сервисов и финансовых систем. Имею практический опыт разработки REST API, интеграции со сторонними сервисами и построения событийной архитектуры на RabbitMQ.',
].join('\n\n');

const profileData = {
  name: 'Роман Ким',
  description,
  links: [
    'https://github.com/MiKaMoRe',
    'https://t.me/mikamore',
  ],
};

const skillsData: string[] = [
  'Go',
  'SQL',
  'PostgreSQL',
  'Redis',
  'RabbitMQ',
  'Docker',
  'Git',
  'Linux',
  'Bash',
  'Swagger',
  'Microservices',
  'Event-Driven Architecture',
  'Performance Optimization',
  'NestJS',
  'GraphQL',
  'Prisma',
  'TypeScript',
  'JavaScript',
  'Frontend Development',
];

type ExperienceSeed = {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  achievements: string[];
};

const experienceData: ExperienceSeed[] = [
  {
    company: 'SW-Payments',
    position: 'Frontend Developer',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-09-01'),
    achievements: [
      'Разрабатывал и поддерживал административную панель для внутренних бизнес-процессов сервиса международных валютных переводов для бизнеса',
      'Создал внутренний текстовый редактор на базе Lexical для управления шаблонами писем и расширенного редактирования',
      'Ускорил загрузку большей части страниц административной панели в полтора-два раза',
    ],
  },
  {
    company: 'Ростелеком Cloud',
    position: 'Backend Developer',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-06-01'),
    achievements: [
      'Разработал и вывел в продакшн интеграцию VMware Cloud Director с Veeam Cloud Backup для автоматизации резервного копирования в облачной инфраструктуре: Redis для кеширования статусов задач, интеграция с общим eventbus на RabbitMQ, логирование через slog, трейсинг через context propagation',
      'Настроил docker-compose для локального окружения и mock Veeam API; сервис обслуживает резервное копирование корпоративных клиентов платформы',
      'Реализовывал REST API для существующих сервисов платформы',
      'Писал интеграционные и unit-тесты на testify',
      'Участвовал в расследовании и устранении критических инцидентов',
      'Помогал с онбордингом новых разработчиков и проводил ревью их кода',
    ],
  },
  {
    company: 'Didlogic',
    position: 'Backend Developer',
    startDate: new Date('2021-10-01'),
    endDate: new Date('2022-10-01'),
    achievements: [
      'Поддерживал backend VoIP-платформы для SIP-телефонии и обработки звонков',
      'Исправлял дефекты и рефакторил устаревшие сервисы',
      'Повышал процент покрытия тестами существующего кода',
      'Поддерживал и актуализировал Swagger-документацию',
    ],
  },
];

const projectsData: { name: string; description: string; link: string }[] = [
  {
    name: 'SW-Payments',
    description:
      'Сервис международных валютных переводов для бизнеса: расчёты между российскими и иностранными организациями.',
    link: 'https://sw-payments.ru',
  },
  {
    name: 'Cloud RT',
    description:
      'Облачная платформа на базе VMware Cloud Director для предоставления IaaS-услуг корпоративным клиентам.',
    link: 'https://www.cloud.rt.ru/',
  },
  {
    name: 'Didlogic',
    description:
      'VoIP-платформа для SIP-телефонии и обработки звонков.',
    link: 'https://didlogic.com/',
  },
  {
    name: 'GraphQL Profile API',
    description:
      'API этого портфолио на NestJS, GraphQL и Prisma.',
    link: 'https://github.com/MiKaMoRe/portfolio-nestjs',
  },
  {
    name: 'Интернет-магазин дронов',
    description:
      'Дипломный проект в колледже',
    link: 'https://github.com/MiKaMoRe/flies',
  },
];

async function main() {
  await prisma.skills.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.projects.deleteMany({});
  await prisma.profile.deleteMany({});

  const profile = await prisma.profile.create({ data: profileData });
  console.log('profile created', { id: profile.id, name: profile.name });

  await prisma.skills.createMany({
    data: skillsData.map((name) => ({ name, profileId: profile.id })),
  });

  await prisma.experience.createMany({
    data: experienceData.map((experience) => ({
      ...experience,
      profileId: profile.id,
    })),
  });

  await prisma.projects.createMany({
    data: projectsData.map((project) => ({
      ...project,
      profileId: profile.id,
    })),
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
