import { hash } from 'bcryptjs';
import dataSource from '../shared/database/data-source.js';
import { toDateOnly } from '../shared/dates/date-only.js';
import { User, UserRole } from '../shared/entities/user.entity.js';
import {
  VacationRequest,
  VacationStatus,
} from '../shared/entities/vacation-request.entity.js';

/** Senha de teste de todos os usuários do seed (apenas desenvolvimento). */
const SEED_PASSWORD = 'ferias123';

const SEED_USERS = [
  {
    name: 'Gabriela Gestora',
    email: 'gestor@empresa.com',
    role: UserRole.MANAGER,
  },
  { name: 'Ana Souza', email: 'ana@empresa.com', role: UserRole.EMPLOYEE },
  { name: 'Bruno Lima', email: 'bruno@empresa.com', role: UserRole.EMPLOYEE },
  { name: 'Carla Mendes', email: 'carla@empresa.com', role: UserRole.EMPLOYEE },
];

/** Dia `day` do mês atual + `monthOffset`. */
function dayOf(monthOffset: number, day: number): string {
  const now = new Date();
  return toDateOnly(
    new Date(now.getFullYear(), now.getMonth() + monthOffset, day),
  );
}

async function seed() {
  await dataSource.initialize();
  await dataSource.runMigrations();

  const users = dataSource.getRepository(User);
  const vacations = dataSource.getRepository(VacationRequest);
  const passwordHash = await hash(SEED_PASSWORD, 10);

  const byEmail = new Map<string, User>();
  for (const data of SEED_USERS) {
    let user = await users.findOneBy({ email: data.email });
    if (!user) {
      user = await users.save(users.create({ ...data, passwordHash }));
      console.log(`[seed] usuário criado: ${data.email}`);
    }
    byEmail.set(data.email, user);
  }

  if ((await vacations.count()) === 0) {
    const manager = byEmail.get('gestor@empresa.com')!;
    const decided = { decidedById: manager.id, decidedAt: new Date() };
    await vacations.save([
      vacations.create({
        userId: byEmail.get('ana@empresa.com')!.id,
        startDate: dayOf(0, 5),
        endDate: dayOf(0, 16),
        status: VacationStatus.APPROVED,
        ...decided,
      }),
      vacations.create({
        userId: byEmail.get('carla@empresa.com')!.id,
        startDate: dayOf(0, 20),
        endDate: dayOf(1, 3),
        status: VacationStatus.APPROVED,
        ...decided,
      }),
      vacations.create({
        userId: byEmail.get('bruno@empresa.com')!.id,
        startDate: dayOf(1, 10),
        endDate: dayOf(1, 24),
        status: VacationStatus.PENDING,
      }),
    ]);
    console.log('[seed] solicitações de exemplo criadas');
  }

  await dataSource.destroy();
  console.log('[seed] concluído');
}

await seed();
