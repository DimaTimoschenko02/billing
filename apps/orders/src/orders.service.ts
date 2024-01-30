import { Inject, Injectable } from '@nestjs/common';
import { Order } from './schemas/order.schema';
import { OrderRepository } from './repositories/order.repository';
import { BILLING_SERVICE } from './constants/service-name';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy) {
  }

  public async createOrder(order: Order) {
    const transaction = await this.orderRepository.startTransaction();

    try {
      const newOrder = await this.orderRepository.create(order);
      await lastValueFrom(this.billingClient.emit('order_created', {
        order,
      }));

      await transaction.commitTransaction();

      return order;
    } catch (err) {
      await transaction.abortTransaction();
      throw err;
    }

  }

  public async getOrders() {
    return this.orderRepository.find();
  }
}
