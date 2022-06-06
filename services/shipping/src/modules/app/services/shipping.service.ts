import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shipment, ShipmentDocument } from "src/schema/shipping.schema";

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(Shipment.name) private shippingModel: Model<ShipmentDocument>,
  ) {}

  async createShipping(email: string, address: object, order: object) {
    const shipment = new this.shippingModel({ email, address, order });
    shipment
      .save()
      .then(() => console.log("Shipment created"))
      .catch((err) => console.error(err));
  }
  async updateStatus(orderId: string, status: string) {
    const result = await this.shippingModel.findOneAndUpdate(
      { order: { $elemMatch: { orderId } } },
      { $set: { "order.$.status": status } },
      { returnNewDocument: true },
    );

    return result;
  }
  async getStatus(orders: any) {
    const result = [];
    await Promise.all(
      orders.map(async (order) => {
        const {
          order: [item],
        } = await this.shippingModel.findOne({
          order: { $elemMatch: { orderId: order } },
        });
        result.push(item);
      }),
    );
    return result;
  }
}
