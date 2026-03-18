import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { RentalsService } from '../rentals/rentals.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private rentalsService: RentalsService,
  ) {}

  async create(rentalId: string, amount: number) {
    const payment = this.paymentsRepository.create({
      rentalId,
      amount,
      status: PaymentStatus.PENDING,
    });
    return this.paymentsRepository.save(payment);
  }

  async processPayment(paymentId: string) {
    const payment = await this.paymentsRepository.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');
    
    payment.status = PaymentStatus.COMPLETED;
    payment.transactionId = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Complete the rental if payment is successful
    await this.rentalsService.completeRental(payment.rentalId);
    
    return this.paymentsRepository.save(payment);
  }

  async findAll() {
    return this.paymentsRepository.find({ relations: ['rental'] });
  }

  async findByRental(rentalId: string) {
    return this.paymentsRepository.find({ where: { rentalId } });
  }
}
