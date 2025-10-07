import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'user',
    nullable: true
  })
  role: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  department: string;

  @Column({
    type: 'boolean',
    default: true
  })
  active: boolean;

  @CreateDateColumn({
    name: 'created_at'
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updated_at: Date;
}