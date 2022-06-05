import { Injectable } from "@nestjs/common";
import { Product, ProductDocument } from "src/schemas/product.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
}
