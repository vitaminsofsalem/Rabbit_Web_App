import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ShipmentDocument = Shipment & Document;

@Schema()
export class Shipment {
  @Prop()
  email: string;

  @Prop()
  address: [];

  @Prop()
  order: any[];
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
