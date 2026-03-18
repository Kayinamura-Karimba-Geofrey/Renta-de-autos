import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendNotification(userId: string, message: string) {
    // In a real app, this would send an email or push notification
    this.logger.log(`Sending notification to User ${userId}: ${message}`);
    return { success: true, message: 'Notification sent' };
  }

  async sendBookingConfirmation(userId: string, bookingDetails: any) {
    const message = `Booking confirmed: ${bookingDetails.carMake} ${bookingDetails.carModel} from ${bookingDetails.startDate} to ${bookingDetails.endDate}`;
    return this.sendNotification(userId, message);
  }
}
