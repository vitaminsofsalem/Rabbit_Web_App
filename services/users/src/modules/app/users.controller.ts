import { Controller, Inject } from "@nestjs/common";
import {
  ClientKafka,
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from "@nestjs/microservices";
import UserAddAddressEvent from "src/dto/address/user-add-address.dto";
import { UserDeleteAddressEvent } from "src/dto/address/user-delete-address.dto";
import UserGetAddressRequestEvent from "src/dto/address/user-get-address-request.dto";
import UserGetAddressResponseEvent from "src/dto/address/user-get-address-response.dto";
import UserGetCartRequestEvent from "src/dto/cart/user-get-cart-request.dto";
import UserGetCartResponseEvent from "src/dto/cart/user-get-cart-response.dto";
import UserUpdateCartEvent from "src/dto/cart/user-update-cart.dto";
import UserAddFavoriteProductEvent from "src/dto/favorite/user-add-favorite-product.dto";
import UserGetFavoriteProductRequestEvent from "src/dto/favorite/user-get-favorite-product-request.dto";
import UserGetFavoriteProductResponseEvent from "src/dto/favorite/user-get-favorite-product-response.dto";
import UserRemoveFavoriteProductEvent from "src/dto/favorite/user-remove-favorite-product.dto";
import EmailVerificationEvent from "src/dto/notification-email-verification.dto";
import UserGetNameRequestEvent from "src/dto/profile-details/user-get-name-request.dto";
import UserGetNameResponseEvent from "src/dto/profile-details/user-get-name-response.dto";
import UserUpdateNameEvent from "src/dto/profile-details/user-update-name.dto";
import UserAuthenticationEvent from "src/dto/user-authenticate.dto";
import UserVerifyRequestEvent from "src/dto/user-verify-request.dto";
import UserVerifyResponseEvent from "src/dto/user-verify-response.dto";
import { UsersService } from "./services/users.service";

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {
    //Examples of emiting an event for the topic: messages
    client.emit("messages", "some data");
  }

  //Example of handling an event on the topic: messages
  //data can be any type, as long as same as what is being sent above
  @MessagePattern("user")
  async handleUserMessages(@Payload("value") data: any) {
    if (data.type === "AUTHENTICATE") {
      const event = data as UserAuthenticationEvent;
      const returnData = await this.usersService.loginUser(event.email);

      const newEvent: EmailVerificationEvent = {
        type: "EMAIL_VERIFICATION",
        email: event.email,
        code: returnData,
      };

      this.client.emit("notification", newEvent);
    } else if (data.type === "VERIFY_REQUEST") {
      const event = data as UserVerifyRequestEvent;
      const returnData = await this.usersService.verifyCodeRequest(
        event.email,
        event.code,
      );

      const newEvent: UserVerifyResponseEvent = {
        type: "VERIFY_RESPONSE",
        email: event.email,
        code: event.code,
        verified: returnData,
      };

      this.client.emit("user", newEvent);
    } else if (data.type === "UPDATE_NAME") {
      const event = data as UserUpdateNameEvent;
      await this.usersService.updateUserName(event.email, event.name);
    } else if (data.type === "GET_NAME_REQUEST") {
      const event = data as UserUpdateNameEvent;
      const returnData = await this.usersService.getUserName(event.email);

      const newEvent: UserGetNameResponseEvent = {
        type: "GET_NAME_RESPONSE",
        email: event.email,
        name: returnData,
      };

      this.client.emit("user", newEvent);
    } else if (data.type === "ADD_ADDRESS") {
      const event = data as UserAddAddressEvent;
      await this.usersService.updateUserAddress(event.email, event.address);
    } else if (data.type === "DELETE_ADDRESS") {
      const event = data as UserDeleteAddressEvent;
      await this.usersService.deleteUserAddress(event.email, event.address);
    } else if (data.type === "GET_ADDRESS_REQUEST") {
      const event = data as UserGetAddressRequestEvent;
      const returnData = await this.usersService.getUserAddresses(event.email);

      const newEvent: UserGetAddressResponseEvent = {
        type: "GET_ADDRESS_RESPONSE",
        email: event.email,
        addresses: returnData,
      };

      this.client.emit("user", newEvent);
    } else if (data.type === "UPDATE_CART") {
      const event = data as UserUpdateCartEvent;
      await this.usersService.updateCart(event.email, event.cart);
    } else if (data.type === "GET_CART_REQUEST") {
      const event = data as UserGetCartRequestEvent;
      const returnData = await this.usersService.getCart(event.email);

      const newEvent: UserGetCartResponseEvent = {
        type: "GET_CART_RESPONSE",
        email: event.email,
        cart: returnData,
      };

      this.client.emit("user", newEvent);
    } else if (data.type === "ADD_FAVORITE") {
      const event = data as UserAddFavoriteProductEvent;
      await this.usersService.addFavoriteProduct(event.email, event.productId);
    } else if (data.type === "REMOVE_FAVORITE") {
      const event = data as UserRemoveFavoriteProductEvent;
      await this.usersService.removeFavoriteProduct(
        event.email,
        event.productId,
      );
    } else if (data.type === "GET_FAVORITES_REQUEST") {
      const event = data as UserGetFavoriteProductRequestEvent;
      const returnData = await this.usersService.getFavoriteProducts(
        event.email,
      );

      const newEvent: UserGetFavoriteProductResponseEvent = {
        type: "GET_FAVORITES_RESPONSE",
        email: event.email,
        favorites: returnData,
      };

      this.client.emit("user", newEvent);
    }
  }
}
