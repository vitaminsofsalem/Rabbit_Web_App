import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "../../../schema/products.schema";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private userModel: Model<ProductDocument>,
  ) {}

  async searchProducts(searchQuery: string) {
    console.log("placeholder");
  }

  async getProducts(filter: object) {
    console.log("placeholder");
  }

  async getHomeProducts() {
    console.log("placeholder");
  }

  async getCategories() {
    console.log("placeholder");
  }

  async getProductMetadata(products: object) {
    console.log("placeholder");
  }
}
