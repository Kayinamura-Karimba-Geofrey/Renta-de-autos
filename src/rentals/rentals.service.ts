import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental, RentalStatus } from './entities/rental.entity';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
    private carsService: CarsService,
  ) {}

  async create(userId: string, carId: string, startDate: Date, endDate: Date) {
    const car = await this.carsService.findOne(carId);
    if (!car.isAvailable) {
      throw new BadRequestException('Car is not available for rental');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      throw new BadRequestException('End date must be after start date');
    }

    const totalPrice = days * car.pricePerDay;

    const rental = this.rentalsRepository.create({
      userId,
      carId,
      startDate: start,
      endDate: end,
      totalPrice,
      status: RentalStatus.PENDING,
    });

    // Update car availability
    await this.carsService.update(carId, { isAvailable: false });

    return this.rentalsRepository.save(rental);
  }

  async findAll() {
    return this.rentalsRepository.find({ relations: ['user', 'car'] });
  }

  async findByUser(userId: string) {
    return this.rentalsRepository.find({ where: { userId }, relations: ['car'] });
  }

  async findOne(id: string) {
    const rental = await this.rentalsRepository.findOne({ where: { id }, relations: ['user', 'car'] });
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return rental;
  }

  async completeRental(id: string) {
    const rental = await this.findOne(id);
    rental.status = RentalStatus.COMPLETED;
    await this.carsService.update(rental.carId, { isAvailable: true });
    return this.rentalsRepository.save(rental);
  }

  async cancelRental(id: string) {
    const rental = await this.findOne(id);
    rental.status = RentalStatus.CANCELLED;
    await this.carsService.update(rental.carId, { isAvailable: true });
    return this.rentalsRepository.save(rental);
  }
}
