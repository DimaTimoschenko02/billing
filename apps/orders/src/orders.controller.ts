import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }

  @Post()
  public async createOrder(@Body() { order }: any): Promise<Order> {
    return this.ordersService.createOrder(order);
  }

  @Get()
  public async getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }
}
