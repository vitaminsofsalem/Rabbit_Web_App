import { Controller, Inject } from "@nestjs/common";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import ProductGetProductsRequestEvent from "src/dto/events/requests/product-get-products-request-event.dto";
import ProductSearchRequestEvent from "src/dto/events/requests/product-search-request-event.dto";
import ProductGetMetadataRequestEvent from "src/dto/events/requests/products-get-metadata-request-event.dto";
import ProductGetHomeResponseEvent from "src/dto/events/response/product-get-home-response-event.dto";
import ProductGetProductsResponseEvent from "src/dto/events/response/product-get-products-response-event.dto";
import ProductSearchResponseEvent from "src/dto/events/response/product-search-response-event.dto";
import ProductGetCategoriesResponseEvent from "src/dto/events/response/products-get-categories-response-event.dto";
import ProductGetMetadataResponseEvent from "src/dto/events/response/products-get-metadata-response-event.dto";
import { ProductsService } from "./services/products.service";

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject("KAFKA_CLIENT") private client: ClientKafka,
  ) {
    //Examples of emiting an event for the topic: messages
    client.emit("messages", "some data");
  }

  //Example of handling an event on the topic: messages
  //data can be any type, as long as same as what is being sent above
  @MessagePattern("products")
  async handleProductsMessages(@Payload("value") data: any) {
    if (data.type === "SEARCH_REQUEST") {
      const event = data as ProductSearchRequestEvent;
      const result = await this.productsService.searchProducts(
        event.searchQuery,
      );

      const newEvent: ProductSearchResponseEvent = {
        type: "SEARCH_RESPONSE",
        searchQuery: event.searchQuery,
        items: result,
      };
      this.client.emit("products", newEvent);
    } else if (data.type === "GET_PRODUCTS_REQUEST") {
      const event = data as ProductGetProductsRequestEvent;
      const result = await this.productsService.getProducts(event.filter);
      const newEvent: ProductGetProductsResponseEvent = {
        type: "GET_PRODUCTS_RESPONSE",
        filter: event.filter,
        items: result,
      };
      this.client.emit("products", newEvent);
    } else if (data.type === "GET_HOME_REQUEST") {
      const result = await this.productsService.getHomeProducts();
      const newEvent: ProductGetHomeResponseEvent = {
        type: "GET_HOME_RESPONSE",
        items: result,
      };
      this.client.emit("products", newEvent);
    } else if (data.type === "GET_CATEGORIES_REQUEST") {
      const result = await this.productsService.getCategories();
      const newEvent: ProductGetCategoriesResponseEvent = {
        type: "GET_CATEGORIES_RESPONSE",
        categories: result,
      };
      this.client.emit("products", newEvent);
    } else if (data.type === "GET_METADATA_REQUEST") {
      const event = data as ProductGetMetadataRequestEvent;
      const result = await this.productsService.getProductMetadata(
        event.products,
      );
      const newEvent: ProductGetMetadataResponseEvent = {
        type: "GET_METADATA_RESPONSE",
        products: result,
      };
      this.client.emit("products", newEvent);
    }
  }
}
