import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('rentals')
@Controller('rentals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create rental booking' })
  create(@Request() req, @Body() body: { carId: string; startDate: Date; endDate: Date }) {
    return this.rentalsService.create(req.user.id, body.carId, body.startDate, body.endDate);
  }

  @Get('my-rentals')
  @ApiOperation({ summary: 'Get current user rentals' })
  findMyRentals(@Request() req) {
    return this.rentalsService.findByUser(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all rentals (Admin only)' })
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rental by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rentalsService.findOne(id);
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Complete rental (Admin only)' })
  complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.rentalsService.completeRental(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel rental' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.rentalsService.cancelRental(id);
  }
}
