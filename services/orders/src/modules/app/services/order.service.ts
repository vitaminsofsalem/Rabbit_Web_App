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

  async createOrder(email: string, items: [], address: object, total: number) {
    const itemsLength = items.length;
    const orderId = uuidv4();
    if (itemsLength < 1 || !email || !address) {
      console.error("Cannot create order, missing data");
      return;
    } else {
      const newOrder = new this.ordersModel(
        { email: email, items: items, address: address, total: total },
        { $set: { orderId: orderId } },
      );
      await newOrder
        .save()
        .then(() => console.log("new order is created"))
        .catch((err) => console.error(err));
    }

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
