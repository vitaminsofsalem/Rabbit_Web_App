import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose } from "mongoose";

export type OrdersDocument = Orders & Document;

@Schema()
export class Orders {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  address: object;

  @Prop({ required: true })
  items: string[];

}

export const OrdersSchema = SchemaFactory.createForClass(Orders);