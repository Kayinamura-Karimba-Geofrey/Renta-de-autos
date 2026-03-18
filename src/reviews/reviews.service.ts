import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async create(userId: string, carId: string, rating: number, comment: string) {
    const review = this.reviewsRepository.create({
      userId,
      carId,
      rating,
      comment,
    });
    return this.reviewsRepository.save(review);
  }

  async findByCar(carId: string) {
    return this.reviewsRepository.find({
      where: { carId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.reviewsRepository.find({ relations: ['user', 'car'] });
  }
}
