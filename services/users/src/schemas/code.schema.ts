import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./users.schema";

export type CodeDocument = Code & Document;

@Schema()
export class Code {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  code: User;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
