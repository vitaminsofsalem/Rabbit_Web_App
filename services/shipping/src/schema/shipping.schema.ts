import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ShipmentDocument = Shipment & Document;

@Schema()
export class Shipment {
  @Prop()
  email: string;

  @Prop()
  order: string;

  @Prop()
  status: string;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
