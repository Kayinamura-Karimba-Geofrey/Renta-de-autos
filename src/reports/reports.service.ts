import { Injectable } from '@nestjs/common';
import { CarsService } from '../cars/cars.service';
import { RentalsService } from '../rentals/rentals.service';
import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class ReportsService {
  constructor(
    private carsService: CarsService,
    private rentalsService: RentalsService,
    private usersService: UsersService,
    private paymentsService: PaymentsService,
  ) {}

  async getAdminStats() {
    const cars = await this.carsService.findAll();
    const rentals = await this.rentalsService.findAll();
    const users = await this.usersService.findAll();
    const payments = await this.paymentsService.findAll();

    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalCars: cars.length,
      availableCars: cars.filter(c => c.isAvailable).length,
      totalRentals: rentals.length,
      activeRentals: rentals.filter(r => r.status === 'active').length,
      totalUsers: users.length,
      totalRevenue,
    };
  }
}
