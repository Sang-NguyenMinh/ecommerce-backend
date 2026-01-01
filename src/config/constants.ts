import { Param } from '@nestjs/common';
import { PaymentController } from './../core/momo/payment.controller';
export enum ROLES {
  ADMIN = 'Admin',
  OWNER = ' Owner',
  USER = 'User',
}

export enum ACCOUNT_TYPE {
  LOCAL = 'Local',
  GOOGLE = 'Google',
}

export enum OrderStatusEnum {
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentTypeEnum {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  MOMO = 'MoMo',
  PAYPAL = 'PayPal',
}
