import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "../../../schema/products.schema";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async searchProducts(searchQuery: string) {
    const result = await this.productModel.find(
      {
        $text: {
          $search: searchQuery,
        },
      },
      { name: true },
    );

    return result;
  }

  async getProducts(filter: any) {
    const result = await this.productModel.find({
      categories: { $elemMatch: { $in: filter.category } },
    });

    return result;
  }

  async getHomeProducts() {
    console.log("placeholder");
  }

  async getCategories() {
    const result = await this.productModel.find({ categories: true });
    const output = [...new Set([].concat(...result.map((o) => o.categories)))]; // set for duplicates, map to loop, spread to flatten inner array values and concat.

    return output;
  }

  async getProductMetadata(products: any) {
    const result = [];
    Promise.all(
      products.map(async (productId) => {
        result.push(await this.productModel.findOne({ id: productId }));
      }),
    );

    return result;
  }
}
