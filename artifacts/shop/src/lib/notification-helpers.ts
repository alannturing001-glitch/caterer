import { notificationApi } from './notification-api';
import { NotificationType, NotificationPriority } from '@/types/notification';

/**
 * Helper functions for creating notifications for catering marketplace events
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  priority: NotificationPriority = NotificationPriority.NORMAL,
  metadata?: any
) => {
  try {
    return await notificationApi.createNotification({
      userId,
      title,
      message,
      type,
      priority,
      metadata
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create quotation received notification
 */
export const createQuotationReceivedNotification = async (
  userId: string,
  caterName: string,
  eventName: string,
  quotationId: string
) => {
  const title = `New Quotation from ${caterName}`;
  const message = `${caterName} has sent a quotation for your ${eventName} event. Review and compare with other quotes.`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.QUOTATION_RECEIVED,
    NotificationPriority.HIGH,
    { quotationId, eventName, caterName }
  );
};

/**
 * Create quotation request sent notification (for caterer)
 */
export const createQuotationRequestedNotification = async (
  catererId: string,
  customerName: string,
  eventName: string,
  guestCount: number,
  eventDate: string
) => {
  const title = `New Quotation Request from ${customerName}`;
  const message = `${customerName} has requested a quotation for ${eventName} (${guestCount} guests) on ${eventDate}. View details and send your quote.`;
  
  return createNotification(
    catererId,
    title,
    message,
    NotificationType.QUOTATION_REQUESTED,
    NotificationPriority.HIGH,
    { customerName, eventName, guestCount, eventDate }
  );
};

/**
 * Create booking confirmed notification
 */
export const createBookingConfirmedNotification = async (
  userId: string,
  caterName: string,
  eventName: string,
  bookingId: string,
  eventDate: string
) => {
  const title = `Booking Confirmed with ${caterName}`;
  const message = `Your booking with ${caterName} for ${eventName} on ${eventDate} has been confirmed. Next: pay deposit.`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.BOOKING_CONFIRMED,
    NotificationPriority.HIGH,
    { bookingId, caterName, eventName, eventDate }
  );
};

/**
 * Create payment due reminder notification
 */
export const createPaymentDueNotification = async (
  userId: string,
  amount: number,
  dueDate: string,
  bookingId: string
) => {
  const title = `Payment Due`;
  const message = `Payment of $${amount} is due by ${dueDate}. Complete payment to confirm your booking.`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.PAYMENT_DUE,
    NotificationPriority.HIGH,
    { amount, dueDate, bookingId }
  );
};

/**
 * Create deposit paid notification
 */
export const createDepositPaidNotification = async (
  userId: string,
  amount: number,
  eventName: string,
  remainingBalance: number
) => {
  const title = `Deposit Received`;
  const message = `Deposit of $${amount} received for ${eventName}. Remaining balance: $${remainingBalance}.`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.PAYMENT_STATUS,
    NotificationPriority.NORMAL,
    { amount, eventName, remainingBalance }
  );
};

/**
 * Create event reminder notification
 */
export const createEventReminderNotification = async (
  userId: string,
  eventName: string,
  eventDate: string,
  daysUntil: number
) => {
  const title = `Event Reminder: ${eventName}`;
  const message = `Reminder: Your event "${eventName}" is happening in ${daysUntil} days on ${eventDate}.`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.EVENT_REMINDER,
    NotificationPriority.NORMAL,
    { eventName, eventDate, daysUntil }
  );
};

/**
 * Create final guest count reminder notification
 */
export const createGuestCountReminderNotification = async (
  userId: string,
  eventName: string,
  deadlineDate: string
) => {
  const title = `Guest Count Due: ${eventName}`;
  const message = `Please confirm final guest count for ${eventName} by ${deadlineDate}.`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.DEPOSIT_REMINDER,
    NotificationPriority.HIGH,
    { eventName, deadlineDate }
  );
};

/**
 * Create review request notification
 */
export const createReviewRequestNotification = async (
  userId: string,
  caterName: string,
  eventName: string,
  bookingId: string
) => {
  const title = `Please Review ${caterName}`;
  const message = `How was your experience with ${caterName} for ${eventName}? Leave a review to help other customers.`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.REVIEW_REQUEST,
    NotificationPriority.NORMAL,
    { caterName, eventName, bookingId }
  );
};

/**
 * Create booking cancelled notification
 */
export const createBookingCancelledNotification = async (
  userId: string,
  caterName: string,
  eventName: string,
  reason?: string
) => {
  const title = `Booking Cancelled: ${eventName}`;
  const message = `Your booking with ${caterName} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`;
  
  return createNotification(
    userId,
    title,
    message,
    NotificationType.BOOKING_CANCELLED,
    NotificationPriority.HIGH,
    { caterName, eventName, reason }
  );
};

export default createNotification;
