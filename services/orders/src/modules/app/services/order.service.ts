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
    const user = await this.ordersModel.findOne({ orderId });
    const email = user.email;
    await this.ordersModel
      .updateOne({ orderId }, { $set: { status } })
      .then(() => console.log("Status Added"))
      .catch((err) => console.error(err));

    return email;
  }

  //get all orders for this email
  async getUserOrders(email: string) {
    const userOrders = await this.ordersModel.find({ email });
    return userOrders;
  }

  async getUserOrder(email: string, orderId: any) {
    const isValid = await this.ordersModel.findOne({ orderId });
    const validEmail = await this.ordersModel.findOne({ email });
    if (!isValid || !validEmail) {
      console.error("Cannot get order, invalid data");
      return;
    } else {
      const orderIS = {
        email: isValid.email,
        orderId: isValid.orderId,
        address: isValid.address,
        items: isValid.items,
      };
      return orderIS;
    }
  }
}
