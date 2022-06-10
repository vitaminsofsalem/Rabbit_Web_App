import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  total: number;

  @Prop({ type: Object })
  deliveryAddress: {
    street: string;
    area: string;
    city: string;
  };

  @Prop({ required: true })
  orderItems: [];

  @Prop()
  status: string;

  @Prop()
  dateTime: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
