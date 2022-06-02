import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  codes: [];

  @Prop()
  addresses: [];

  @Prop()
  cart: [];

  @Prop()
  favorites: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
