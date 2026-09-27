import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
