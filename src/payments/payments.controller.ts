import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment (Admin/Customer)' })
  create(@Body() body: { rentalId: string; amount: number }) {
    return this.paymentsService.create(body.rentalId, body.amount);
  }

  @Patch(':id/process')
  @ApiOperation({ summary: 'Process payment' })
  process(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.processPayment(id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('rental/:rentalId')
  @ApiOperation({ summary: 'Get payments for a rental' })
  findByRental(@Param('rentalId', ParseUUIDPipe) rentalId: string) {
    return this.paymentsService.findByRental(rentalId);
  }
}
