import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ index: true })
  name: string;

  @Prop()
  price: number;

  @Prop({ index: true })
  subtext: string;

  @Prop()
  imageURL: string;

  @Prop()
  currentQuantity: number;

  @Prop({ type: Object })
  categories: object;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
