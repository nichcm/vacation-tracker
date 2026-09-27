import { ConflictException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { QueryFailedError, type Repository } from 'typeorm';
import { type User, UserRole } from '../../../shared/entities/user.entity.js';
import { CreateUserHandler } from './create-user.handler.js';

const request = {
  name: '  Rafael Costa ',
  email: ' Rafael@Empresa.com ',
  password: 'senha-segura',
  role: UserRole.MANAGER,
};

describe('CreateUserHandler', () => {
  let repo: {
    exists: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let handler: CreateUserHandler;

  beforeEach(() => {
    repo = {
      exists: vi.fn().mockResolvedValue(false),
      create: vi.fn((data: Partial<User>) => data),
      save: vi.fn((data: Partial<User>) =>
        Promise.resolve({ id: 'u-1', createdAt: new Date(), ...data }),
      ),
    };
    handler = new CreateUserHandler(repo as unknown as Repository<User>);
  });

  it('normaliza nome/e-mail, grava o hash da senha e não o expõe', async () => {
    const result = await handler.execute(request);

    expect(result).toMatchObject({
      name: 'Rafael Costa',
      email: 'rafael@empresa.com',
      role: UserRole.MANAGER,
    });
    expect(result).not.toHaveProperty('passwordHash');

    const saved = repo.save.mock.calls[0][0] as User;
    expect(saved.passwordHash).not.toBe(request.password);
    expect(await compare(request.password, saved.passwordHash)).toBe(true);
  });

  it('rejeita e-mail já cadastrado', async () => {
    repo.exists.mockResolvedValue(true);
    await expect(handler.execute(request)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('converte violação de unicidade do banco em 409', async () => {
    const error = new QueryFailedError('INSERT', [], {
      code: '23505',
    } as never);
    repo.save.mockRejectedValue(error);
    await expect(handler.execute(request)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
