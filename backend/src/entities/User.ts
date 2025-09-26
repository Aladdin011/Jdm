import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @Column({
    type: 'varchar',
    length: 100
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'user'
  })
  role: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  department: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  company: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  location: string;

  @Column({
    type: 'boolean',
    default: true
  })
  active: boolean;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  lastLogin: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}