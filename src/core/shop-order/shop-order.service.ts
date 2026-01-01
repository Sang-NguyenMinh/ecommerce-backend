import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShopOrder, ShopOrderDocument } from './schemas/shop-order.schema';
import {
  OrderLine,
  OrderLineDocument,
} from '../order-line/schemas/order-line.schema';
import { BaseService } from '../base/base.service';
import {
  CreateShopOrderDto,
  UpdateShopOrderDto,
  TrackGuestOrderDto,
} from './dto/shop-order.dto';
import { OrderStatusEnum, PaymentTypeEnum } from 'src/config/constants';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  UserAddress,
  UserAddressDocument,
} from '../user-address/schemas/user-address.schema';

@Injectable()
export class ShopOrderService extends BaseService<ShopOrderDocument> {
  constructor(
    @InjectModel(ShopOrder.name)
    private shopOrderModel: Model<ShopOrderDocument>,
    @InjectModel(OrderLine.name)
    private orderLineModel: Model<OrderLineDocument>,

    @InjectModel(UserAddress.name)
    private userAddressModel: Model<UserAddressDocument>,

    private readonly mailerService: MailerService,
  ) {
    super(shopOrderModel);
  }

  async create(createDto: CreateShopOrderDto): Promise<any> {
    const session = await this.shopOrderModel.db.startSession();
    session.startTransaction();

    try {
      if (!createDto.orderItems || createDto.orderItems.length === 0) {
        throw new HttpException(
          'Order must have at least one item',
          HttpStatus.BAD_REQUEST,
        );
      }

      const orderTotal = createDto.orderItems.reduce((sum, item) => {
        return sum + item.price * item.qty;
      }, 0);

      let orderData: any = {
        orderStatus:
          createDto.paymentType == PaymentTypeEnum.CASH
            ? OrderStatusEnum.PENDING
            : OrderStatusEnum.PAYMENT_PENDING,
        paymentType: createDto.paymentType,
        orderTotal,
        shippingMethodId: createDto.shippingMethodId,
      };

      if (createDto.isGuestOrder) {
        if (
          !createDto.guestEmail ||
          !createDto.guestPhone ||
          !createDto.guestName ||
          !createDto.guestShippingAddress
        ) {
          throw new HttpException(
            'Guest orders require: guestEmail, guestPhone, guestName, and guestShippingAddress',
            HttpStatus.BAD_REQUEST,
          );
        }

        orderData = {
          ...orderData,
          isGuestOrder: true,
          orderToken: randomBytes(32).toString('hex'),
          guestEmail: createDto.guestEmail,
          guestPhone: createDto.guestPhone,
          guestName: createDto.guestName,
          guestShippingAddress: createDto.guestShippingAddress,
        };
      }
      // Handle USER ORDER
      else {
        if (!createDto.userId) {
          throw new HttpException(
            'User orders require userId',
            HttpStatus.BAD_REQUEST,
          );
        }

        const userAddresses = await this.userAddressModel
          .find({
            userId: new Types.ObjectId(createDto.userId),
            isActive: true,
          })
          .session(session)
          .lean();

        let shippingAddressId: Types.ObjectId;

        if (userAddresses.length === 0) {
          if (
            !createDto.recipientName ||
            !createDto.phoneNumber ||
            !createDto.address ||
            !createDto.city ||
            !createDto.district ||
            !createDto.ward
          ) {
            throw new HttpException(
              'First-time users must provide complete address information: recipientName, phoneNumber, address, city, district, ward',
              HttpStatus.BAD_REQUEST,
            );
          }

          const [newAddress] = await this.userAddressModel.create(
            [
              {
                userId: new Types.ObjectId(createDto.userId),
                recipientName: createDto.recipientName,
                phoneNumber: createDto.phoneNumber,
                address: createDto.address,
                city: createDto.city,
                district: createDto.district,
                ward: createDto.ward,
                isDefault: true,
                isActive: true,
              },
            ],
            { session },
          );

          shippingAddressId = newAddress._id as Types.ObjectId;
        } else {
          // EXISTING USER - Use provided address or default
          if (createDto.shippingAddress) {
            const addressExists = userAddresses.some(
              (addr) => addr._id.toString() === createDto.shippingAddress,
            );
            if (!addressExists) {
              throw new HttpException(
                'Invalid shipping address ID',
                HttpStatus.BAD_REQUEST,
              );
            }
            shippingAddressId = new Types.ObjectId(createDto.shippingAddress);
          } else {
            const defaultAddress = userAddresses[0];
            shippingAddressId = defaultAddress._id as Types.ObjectId;
          }
        }

        orderData = {
          ...orderData,
          isGuestOrder: false,
          userId: new Types.ObjectId(createDto.userId),
          shippingAddress: shippingAddressId,
        };
      }

      const [order] = await this.shopOrderModel.create([orderData], {
        session,
      });

      const orderLines = createDto.orderItems.map((item) => ({
        orderId: order._id,
        productItemId: new Types.ObjectId(item.productItemId),
        qty: item.qty,
        price: item.price,
      }));

      await this.orderLineModel.insertMany(orderLines, { session });

      await await session.commitTransaction();

      // Send confirmation email
      // try {
      //   const emailContext: any = {
      //     orderId: order._id,
      //     orderTotal: order.orderTotal,
      //     orderItems: createDto.orderItems,
      //     orderDate: new Date().toLocaleDateString('vi-VN'),
      //     trackingUrl: `http://localhost:3000/track-order?orderId=${order._id}`,
      //   };

      //   if (createDto.isGuestOrder) {
      //     emailContext.name = order.guestName;
      //     emailContext.shippingAddress = order.guestShippingAddress;

      //     await this.mailerService.sendMail({
      //       from: 'msang.nms@gmail.com',
      //       to: order.guestEmail,
      //       subject: 'Xác nhận đơn hàng',
      //       template: 'order-confirmation',
      //       context: emailContext,
      //     });
      //   } else {
      //     const addressInfo = await this.userAddressModel
      //       .findById(order.shippingAddress)
      //       .lean();

      //     emailContext.name = addressInfo?.recipientName || 'Khách hàng';
      //     emailContext.shippingAddress = `${addressInfo?.address}, ${addressInfo?.ward}, ${addressInfo?.district}, ${addressInfo?.city}`;

      //     // Get user email (you might need to inject UserService for this)
      //     // For now, using guestEmail if provided
      //     const recipientEmail = createDto.guestEmail || 'nmsang.dev@gmail.com';

      //     await this.mailerService.sendMail({
      //       from: 'msang.nms@gmail.com',
      //       to: recipientEmail,
      //       subject: 'Xác nhận đơn hàng',
      //       template: 'order-confirmation',
      //       context: emailContext,
      //     });
      //   }
      // } catch (emailError) {
      //   console.error('Error sending order confirmation email:', emailError);
      // }

      return {
        order: {
          _id: order._id,
          orderToken: order.orderToken,
          orderStatus: order.orderStatus,
          orderTotal: order.orderTotal,
          isGuestOrder: order.isGuestOrder,
          guestEmail: order.guestEmail,
        },
        message: 'Order created successfully',
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating order:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error creating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }
  async markOrderPaid(payload: {
    orderId: string;
    transId: string;
    paidAt: Date;
  }) {
    console.log('đánh dấy ok');
    return this.shopOrderModel.updateOne(
      { _id: payload.orderId },
      {
        $set: {
          orderStatus: OrderStatusEnum.PENDING,
          transactionId: payload.transId,
          paidAt: payload.paidAt,
        },
      },
    );
  }

  async updatePaymentFailed(orderId: string, resultCode: string) {
    return this.shopOrderModel.updateOne(
      { _id: orderId },
      {
        $set: {
          paymentStatus: 'FAILED',
          orderStatus: OrderStatusEnum.PAYMENT_FAILED,
          paymentFailReason: resultCode,
        },
      },
    );
  }

  async trackGuestOrder(trackDto: TrackGuestOrderDto): Promise<any> {
    try {
      const order = await this.shopOrderModel
        .findOne({
          isGuestOrder: true,
        })
        .populate('shippingMethodId')
        .lean();

      if (!order) {
        throw new HttpException(
          'Order not found or invalid credentials',
          HttpStatus.NOT_FOUND,
        );
      }

      const orderLines = await this.orderLineModel
        .find({ orderId: order._id })
        .populate('productItemId')
        .lean();

      return {
        order,
        orderLines,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error tracking guest order:', error);
      throw new HttpException(
        'Error tracking order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateShopOrderDto,
  ): Promise<ShopOrderDocument> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      // Remove orderItems from update if present
      const { orderItems, ...updateData } = updateDto as any;

      const updated = await this.shopOrderModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, lean: false },
      );

      if (!updated) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating order:', error);
      throw new HttpException(
        'Error updating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const session = await this.shopOrderModel.db.startSession();
    session.startTransaction();

    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      // Delete order lines first
      await this.orderLineModel.deleteMany(
        { orderId: new Types.ObjectId(id) },
        { session },
      );

      const deleted = await this.shopOrderModel.findByIdAndDelete(id, {
        session,
      });

      if (!deleted) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      await session.commitTransaction();
      return { message: 'Order deleted successfully' };
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error deleting order:', error);
      throw new HttpException(
        'Error deleting order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }

  async getOrdersByUserId(userId: string) {
    try {
      return await this.findAll(
        { userId: new Types.ObjectId(userId), isActive: true },
        {
          populate: ['shippingAddress', 'shippingMethodId'],
          sort: { createdAt: -1 },
          lean: true,
        },
      );
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw new HttpException(
        'Error fetching orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrdersByStatus(status: OrderStatusEnum) {
    try {
      return await this.findAll(
        { orderStatus: status, isActive: true },
        {
          populate: ['userId', 'shippingAddress', 'shippingMethodId'],
          sort: { createdAt: -1 },
          lean: true,
        },
      );
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw new HttpException(
        'Error fetching orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTotalRevenue(userId?: string): Promise<number> {
    try {
      const filter: any = {
        orderStatus: OrderStatusEnum.DELIVERED,
        isActive: true,
      };

      if (userId) {
        if (!Types.ObjectId.isValid(userId)) {
          throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
        }
        filter.userId = new Types.ObjectId(userId);
      }

      const orders = await this.shopOrderModel.find(filter);

      return orders.reduce((total, order) => {
        return total + (order.orderTotal || 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating revenue:', error);
      throw new HttpException(
        'Error calculating revenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderStatus(
    id: string,
    orderStatus: OrderStatusEnum,
  ): Promise<ShopOrderDocument> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      const updated = await this.shopOrderModel.findByIdAndUpdate(
        id,
        { orderStatus },
        { new: true, lean: false },
      );

      if (!updated) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      return updated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error updating order status:', error);
      throw new HttpException(
        'Error updating order status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderWithDetails(orderId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(orderId)) {
        throw new HttpException('Invalid order ID', HttpStatus.BAD_REQUEST);
      }

      const order = await this.shopOrderModel
        .findById(orderId)
        .populate('userId')
        .populate('shippingAddress')
        .populate('shippingMethodId')
        .lean();

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      const orderLines = await this.orderLineModel
        .find({ orderId: new Types.ObjectId(orderId) })
        .populate('productItemId')
        .lean();

      return {
        order,
        orderLines,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error getting order details:', error);
      throw new HttpException(
        'Error fetching order details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Track order chỉ cần orderId, không cần email
  async trackGuestOrderByOrderId(orderId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(orderId)) {
        throw new HttpException('Invalid order ID', HttpStatus.BAD_REQUEST);
      }
      const order = await this.shopOrderModel
        .findOne({
          _id: new Types.ObjectId(orderId),
        })
        .populate('shippingMethodId')
        .lean();

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      const orderLines = await this.orderLineModel
        .find({ orderId: order._id })
        .populate('productItemId')
        .lean();

      return {
        order,
        orderLines,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error tracking guest order:', error);
      throw new HttpException(
        'Error tracking order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
