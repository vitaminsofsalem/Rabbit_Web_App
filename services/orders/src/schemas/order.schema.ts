import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  email: string;

  @Prop()
  address: object;

  @Prop({ required: true })
  items: [];

  @Prop({ required: true })
  orderId: any;

  @Prop()
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
