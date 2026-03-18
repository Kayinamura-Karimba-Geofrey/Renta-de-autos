import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CarCategory {
  ECONOMY = 'economy',
  LUXURY = 'luxury',
  SUV = 'suv',
}

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({
    type: 'simple-enum',
    enum: CarCategory,
    default: CarCategory.ECONOMY,
  })
  category: CarCategory;

  @Column('decimal')
  pricePerDay: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
