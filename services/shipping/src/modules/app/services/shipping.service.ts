import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shipment, ShipmentDocument } from "src/schema/shipping.schema";

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipment.name) private shippingModel: Model<ShipmentDocument>,
  ) {}

  async createShipping(email: string, order: string) {
    const shipment = new this.shippingModel({
      email,
      order,
      status: "CREATED",
    });
    shipment
      .save()
      .then(() => console.log("Shipment created"))
      .catch((err) => console.error(err));
  }
  async updateStatus(orderId: string, status: string) {
    const result = await this.shippingModel.findOneAndUpdate(
      { order: { $elemMatch: { orderId } } },
      { $set: { status: status } },
      { returnNewDocument: true },
    );

    return result;
  }
  async getStatus(orders: any) {
    const output = [];
    await Promise.all(
      orders.map(async (order) => {
        const result = await this.shippingModel.findOne({
          order: order,
        });
        output.push({ orderId: order, status: result.status });
      }),
    );
    return output;
  }
}
