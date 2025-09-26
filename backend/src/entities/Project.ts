import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('projects')
export class Project {
  @Column({
    type: 'varchar',
    length: 100
  })
  title: string;

  @Column({
    type: 'text'
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 50
  })
  category: string;

  @Column({
    type: 'varchar',
    length: 100
  })
  location: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true
  })
  budget: number;

  @Column({
    type: 'date',
    nullable: true
  })
  startDate: Date;

  @Column({
    type: 'date',
    nullable: true
  })
  estimatedEndDate: Date;

  @Column({
    type: 'simple-array',
    nullable: true
  })
  features: string[];

  @Column({
    type: 'simple-array',
    nullable: true
  })
  tags: string[];

  @Column({
    type: 'varchar',
    length: 50,
    default: 'planning'
  })
  status: string;

  @Column({
    type: 'int',
    default: 0
  })
  progress: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  client: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'medium'
  })
  priority: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  manager: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0
  })
  spent: number;

  @PrimaryGeneratedColumn()
  id: number;

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