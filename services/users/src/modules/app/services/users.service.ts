import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { User, UserDocument } from "../../../schemas/users.schema";
import { Code, CodeDocument } from "../../../schemas/code.schema";
import userCreatedDto from "../../../dto/user/user-details.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async loginUser(email: string) {
    const user = new this.userModel({ email });

    const check = await this.userModel.findOne({ email });
    if (!check) {
      await user
        .save()
        .then(() => console.log("User created"))
        .catch((err) => console.error(err));
    }
    // Generate code with 2 upperCase start, small case, 2 upperCase end
    const code =
      Math.random().toString(36).substring(2, 4).toUpperCase() +
      Math.random().toString(36).substring(2, 4) +
      Math.random().toString(36).substring(2, 4).toUpperCase();

    await this.userModel
      .updateOne({ email }, { $push: { codes: code } })
      .then(() => console.log("Code Added"))
      .catch((err) => console.error(err));

    return code;
  }

  async verifyCodeRequest(email: string, code: string) {
    const user = await this.userModel.findOne({ email });

    if (code == user.codes.slice(-1).toString()) {
      await this.userModel
        .updateOne({ email }, { $unset: { codes: "" } })
        .then(() => console.log("Codes cleared"))
        .catch((err) => console.error(err));
      return true;
    }
    return false;
  }

  async updateUserName(email: string, name: string) {
    await this.userModel
      .updateOne({ email }, { $set: { name } })
      .then(() => console.log("Name Added"))
      .catch((err) => console.error(err));
  }

  async getUserName(email: string) {
    const user = await this.userModel.findOne({ email });

    return user.name || undefined; // short circuit with undefined if not exists
  }

  async updateUserAddress(email: string, address: object) {
    await this.userModel
      .updateOne(
        { email },
        {
          $push: {
            addresses: address,
          },
        },
      )
      .then(() => {
        console.log("Address Added");
      })
      .catch((err) => console.error(err));
  }

  async deleteUserAddress(email: string, address: object) {
    await this.userModel
      .updateOne(
        { email },
        {
          $pull: {
            addresses: address,
          },
        },
      )
      .then(() => {
        console.log("Address Deleted");
      })
      .catch((err) => console.error(err));
  }

  async getUserAddresses(email: string) {
    const user = await this.userModel.findOne({ email });
    return user.addresses;
  }

  async updateCart(email: string, cart: object) {
    const user = await this.userModel.findOne({ email });
    await this.userModel
      .updateOne({ email }, { $set: { cart } })
      .then(() => {
        console.log("Cart Items Updated");
      })
      .catch((err) => console.error(err));
  }

  async getCart(email: string) {
    const user = await this.userModel.findOne({ email });
    return user.cart;
  }

  async addFavoriteProduct(email: string, productId: string) {
    await this.userModel
      .updateOne({ email }, { $push: { favorites: productId } })
      .then(() => {
        console.log("Favorite Product Added");
      })
      .catch((err) => console.error(err));
  }
  async removeFavoriteProduct(email: string, productId: string) {
    await this.userModel
      .updateOne({ email }, { $pull: { favorites: productId } })
      .then(() => {
        console.log("Favorite Product Removed");
      })
      .catch((err) => console.error(err));
  }

  async getFavoriteProducts(email: string) {
    const user = await this.userModel.findOne({ email });
    return user.favorites;
  }
}
