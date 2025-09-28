import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

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
    type: 'simple-json',
    nullable: true
  })
  features: { name: string; description: string }[];

  @Column({
    type: 'simple-array',
    nullable: true
  })
  tags: string[];

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending'
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
    length: 20,
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
    length: 100,
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

  @Column({
    type: 'boolean',
    default: false
  })
  public: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}