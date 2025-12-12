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
  PENDING = 'PENDING', // Chờ xác nhận
  CONFIRMED = 'CONFIRMED', // Đã xác nhận
  PROCESSING = 'PROCESSING', // Đang xử lý
  SHIPPING = 'SHIPPING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao hàng
  CANCELLED = 'CANCELLED', // Đã hủy
  RETURNED = 'RETURNED', // Đã trả hàng
}

export enum PaymentTypeEnum {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  MOMO = 'MoMo',
  PAYPAL = 'PayPal',
}
