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
    const result = await this.productModel.find({
      $text: {
        $search: searchQuery,
      },
    });

    return result;
  }

  async getProducts(filter: any) {
    const result = await this.productModel.find({
      categories: { $in: [filter.category] },
    });

    return result;
  }

  /**
   * * Method fetches list of categories from the database as an array
   * * iterates through it and returns array of documents in each respective category
   * ? @returns output Array[Objects]
   */
  async getHomeProducts() {
    const result = await this.productModel.find({}, { categories: true });
    const categories = [
      ...new Set([].concat(...result.map((o) => o.categories))),
    ]; // set for duplicates, map to loop, spread to flatten inner array values and concat.
    const output = [];
    await Promise.all(
      categories.map(async (category) => {
        const products = await this.productModel.find({
          categories: { $in: [category] },
        });

        const myObj = {
          category,
          products,
        };
        output.push(myObj);
      }),
    );

    return output;
  }

  async getCategories() {
    const result = await this.productModel.find({}, { categories: true });
    const output = [...new Set([].concat(...result.map((o) => o.categories)))]; // set for duplicates, map to loop, spread to flatten inner array values and concat.

    return output;
  }

  async getProductMetadata(products: any) {
    const result = [];
    await Promise.all(
      products.map(async (productId) => {
        result.push(await this.productModel.findOne({ id: productId }));
      }),
    );

    console.log(result);
    return result;
  }
}
