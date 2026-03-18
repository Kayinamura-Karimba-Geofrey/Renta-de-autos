import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car, CarCategory } from './entities/car.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create car (Admin only)' })
  create(@Body() carData: Partial<Car>) {
    return this.carsService.create(carData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars' })
  findAll() {
    return this.carsService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available cars' })
  findAvailable() {
    return this.carsService.findAvailable();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update car (Admin only)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateData: Partial<Car>) {
    return this.carsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.remove(id);
  }
}
