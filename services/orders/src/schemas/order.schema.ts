import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  total: object;

  @Prop()
  address: object;

  @Prop({ required: true })
  orderItems: [];

  @Prop()
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
