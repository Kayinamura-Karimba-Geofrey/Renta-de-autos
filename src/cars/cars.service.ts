import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) {}

  async create(carData: Partial<Car>) {
    const car = this.carsRepository.create(carData);
    return this.carsRepository.save(car);
  }

  async findAll() {
    return this.carsRepository.find();
  }

  async findOne(id: string) {
    const car = await this.carsRepository.findOne({ where: { id } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  async update(id: string, updateData: Partial<Car>) {
    await this.carsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const car = await this.findOne(id);
    return this.carsRepository.remove(car);
  }

  async findAvailable() {
    return this.carsRepository.find({ where: { isAvailable: true } });
  }
}
