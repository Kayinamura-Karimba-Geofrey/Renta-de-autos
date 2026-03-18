import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a car' })
  create(@Request() req, @Body() body: { carId: string; rating: number; comment: string }) {
    return this.reviewsService.create(req.user.id, body.carId, body.rating, body.comment);
  }

  @Get('car/:carId')
  @ApiOperation({ summary: 'Get reviews for a car' })
  findByCar(@Param('carId', ParseUUIDPipe) carId: string) {
    return this.reviewsService.findByCar(carId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  findAll() {
    return this.reviewsService.findAll();
  }
}
