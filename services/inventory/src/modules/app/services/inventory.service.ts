import { Injectable } from "@nestjs/common";
import { Product, ProductDocument } from "src/schemas/product.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { parse } from "csv-parse/sync";

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async updateInventory(csvContents: string) {
    try {
      const products = this.parseCsvContents(csvContents);
      for (const product of products) {
        await this.productModel.replaceOne({ id: product.id }, product, {
          upsert: true, //If none matching exist, still add the product
        });
      }
      console.log("CSV processed and updated DB");
    } catch (e) {
      console.error("Failed to update inventory from csv:", e);
    }
  }

  private parseCsvContents(csvContents: string): Product[] {
    if (
      !csvContents.startsWith(
        "id,name,price,subtext,imageUrl,currentQuantity,categories\n",
      )
    ) {
      throw new Error("Invalid csv");
    }

    const records = parse(csvContents, {
      columns: true,
      skip_empty_lines: true,
    });

    const products: Product[] = records.map((record: any) => {
      let categories = (record.categories as string).split(",");
      categories = categories.map((item) => item.trim());
      return { ...record, categories };
    });
    return products;
  }

  async decrementItemStock(productId: string, quantity: number) {
    await this.productModel.updateOne(
      { id: productId },
      { $inc: { currentQuantity: -1 * quantity } },
    );
    console.log("Updated stock of", productId);
  }
}
