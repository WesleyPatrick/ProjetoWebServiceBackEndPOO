import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsEmail, IsString } from 'class-validator';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Goal } from 'src/goal/entities/goal.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transactions: Transaction[];

  @OneToMany(() => Goal, (goal) => goal.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'goal_id' })
  goals: Goal[];
}
