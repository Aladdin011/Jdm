import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100
  })
  email: string;

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
  company: string;

  @Column({
    type: 'varchar',
    length: 100
  })
  subject: string;

  @Column({
    type: 'text'
  })
  message: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  projectType: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  budget: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  timeline: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  location: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  source: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'new'
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'medium'
  })
  priority: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  assignedTo: string;

  @Column({
    type: 'text',
    nullable: true
  })
  notes: string;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  followUpDate: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}