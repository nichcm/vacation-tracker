import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity.js';

export enum VacationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('vacation_requests')
@Index('idx_vacation_requests_status_period', [
  'status',
  'startDate',
  'endDate',
])
export class VacationRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  /** Data no formato AAAA-MM-DD (coluna `date`, sem fuso horário). */
  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  /** Data no formato AAAA-MM-DD, inclusiva. */
  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({
    type: 'enum',
    enum: VacationStatus,
    enumName: 'vacation_status',
    default: VacationStatus.PENDING,
  })
  status: VacationStatus;

  @Column({ name: 'decided_by', type: 'uuid', nullable: true })
  decidedById: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'decided_by' })
  decidedBy?: User | null;

  @Column({ name: 'decided_at', type: 'timestamptz', nullable: true })
  decidedAt: Date | null;

  @Column({
    name: 'rejection_reason',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  rejectionReason: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
