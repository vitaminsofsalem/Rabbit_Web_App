import { Injectable } from "@nestjs/common";
import { Order, OrderDocument } from "src/schemas/order.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private ordersModel: Model<OrderDocument>,
  ) {}

  async createOrder(
    email: string,
    total: number,
    address: object,
    orderItems: object,
  ) {
    const orderId = uuidv4();

    // order items array contains ids of items not the id of the order itself
    const newOrder = new this.ordersModel({
      orderId,
      email,
      total,
      address,
      orderItems,
    });

    await newOrder
      .save()
      .then(() => console.log("New order created"))
      .catch((err) => console.error(err));

    //we need to return orderId
    return orderId;
  }

  async updateStatus(orderId: any, status: string) {
    const { email } = await this.ordersModel.findOneAndUpdate(
      { orderId },
      { $set: { status } },
      { returnNewDocument: true },
    );

    return email;
  }

  //get all orders for this email
  async getUserOrders(email: string) {
    const result = [];
    const userOrders = await this.ordersModel.find({ email });
    userOrders.forEach((order) => {
      result.push(order.orderId);
    });
    return result;
  }

  async getUserOrder(email: string, orderId: string) {
    const order = await this.ordersModel.findOne({
      $and: [{ email }, { orderId }],
    });
    return order;
  }
}
