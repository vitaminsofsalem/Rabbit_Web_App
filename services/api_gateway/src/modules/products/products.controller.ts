import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Product } from "src/model/Product";
import { PendingRequestHolder } from "src/util/PendingRequestHolder";
import { RequestIdGenerator } from "src/util/RequestIdGenerator";
import { AdminAuthGuard } from "../auth/admin-auth.guard";
import {
  GetMetadataRequestEvent,
  GetMetadatResponseEvent,
} from "../user/dto/events/metadata-event";
import {
  GetCategoriesRequestEvent,
  GetCategoriesResponseEvent,
} from "./dto/events/get-categories.dto";
import {
  GetHomeRequestEvent,
  GetHomeResponseEvent,
} from "./dto/events/get-home.dto";
import {
  GetProductsRequestEvent,
  GetProductsResponseEvent,
} from "./dto/events/get-products.dto";
import { IngestCsvEvent } from "./dto/events/ingest-csv.dto";
import {
  SearchRequestEvent,
  SearchResponseEvent,
} from "./dto/events/search.dto";
import { Category, GetCategoriesResponseDto } from "./dto/get-categories.dto";
import { CategoryProducts, GetHomeResponseDto } from "./dto/get-home.dto";
import {
  GetProductDetailsDto,
  GetProductsResponseDto,
} from "./dto/get-products.dto";
import { IngestCsvRequestDto } from "./dto/ingest-csv.dto";
import { ProductsEventhandler } from "./event-handlers/ProductsEventHandler";

@Controller("products")
export class ProductsController {
  constructor(@Inject("KAFKA_CLIENT") private readonly client: ClientKafka) {}

  @Get("home")
  async getHome(): Promise<GetHomeResponseDto> {
    const requestEvent: GetHomeRequestEvent = {
      type: "GET_HOME_REQUEST",
    };

    this.client.emit("products", requestEvent);
    const requestId = RequestIdGenerator.generateGetHomeRequestId();

    return { items: await this.waitForHomeResponse(requestId) };
  }

  @Get("categories")
  async getCategories(): Promise<GetCategoriesResponseDto> {
    const requestEvent: GetCategoriesRequestEvent = {
      type: "GET_CATEGORIES_REQUEST",
    };

    this.client.emit("products", requestEvent);
    const requestId = RequestIdGenerator.generateGetCategoriesRequestId();

    return { categories: await this.waitForCategoriesResponse(requestId) };
  }

  @Get("category/:category")
  async getProductsForCategory(
    @Param("category") category: string,
  ): Promise<GetProductsResponseDto> {
    const requestEvent: GetProductsRequestEvent = {
      type: "GET_PRODUCTS_REQUEST",
      filter: { category },
    };

    this.client.emit("products", requestEvent);
    const requestId = RequestIdGenerator.generateGetProductsRequestId(
      requestEvent.filter,
    );

    return { products: await this.waitForProductsResponse(requestId) };
  }

  @Get("search?")
  async searchProduct(
    @Query("query") query: string,
  ): Promise<GetProductsResponseDto> {
    const requestEvent: SearchRequestEvent = {
      type: "SEARCH_REQUEST",
      searchQuery: query,
    };

    this.client.emit("products", requestEvent);
    const requestId = RequestIdGenerator.generateSearchProductsRequestId(
      requestEvent.searchQuery,
    );

    return { products: await this.waitForSearchResponse(requestId) };
  }

  @Get(":id")
  async getProductDetails(
    @Param("id") id: string,
  ): Promise<GetProductDetailsDto> {
    const metaDataRequestEvent: GetMetadataRequestEvent = {
      type: "GET_METADATA_REQUEST",
      products: [id],
    };
    this.client.emit("products", metaDataRequestEvent);
    const requestId = RequestIdGenerator.generateMetaDataRequestId([id]);

    const result = await this.waitForMetaDataResponse(requestId);
    if (result.length === 0) {
      throw new HttpException("Product not found", HttpStatus.NOT_FOUND);
    }
    return { product: result[0] };
  }

  @UseGuards(AdminAuthGuard)
  @Post("csv")
  async ingestCsv(@Body() body: IngestCsvRequestDto) {
    const requestEvent: IngestCsvEvent = {
      type: "INGEST",
      file: Buffer.from(body.fileBase64, "base64").toString(),
    };
    this.client.emit("products", requestEvent);
  }

  private waitForHomeResponse(requestId: string): Promise<CategoryProducts[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (ProductsEventhandler.responseCache.has(requestId)) {
        const responseEvent = ProductsEventhandler.responseCache.get(
          requestId,
        ) as GetHomeResponseEvent;
        ProductsEventhandler.responseCache.del(requestId);
        complete(responseEvent.items);
      }
    });
  }
  private waitForCategoriesResponse(requestId: string): Promise<string[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (ProductsEventhandler.responseCache.has(requestId)) {
        const responseEvent = ProductsEventhandler.responseCache.get(
          requestId,
        ) as GetCategoriesResponseEvent;
        ProductsEventhandler.responseCache.del(requestId);
        complete(responseEvent.categories);
      }
    });
  }

  private waitForProductsResponse(requestId: string): Promise<Product[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (ProductsEventhandler.responseCache.has(requestId)) {
        const responseEvent = ProductsEventhandler.responseCache.get(
          requestId,
        ) as GetProductsResponseEvent;
        ProductsEventhandler.responseCache.del(requestId);
        complete(responseEvent.items);
      }
    });
  }

  private waitForSearchResponse(requestId: string): Promise<Product[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (ProductsEventhandler.responseCache.has(requestId)) {
        const responseEvent = ProductsEventhandler.responseCache.get(
          requestId,
        ) as SearchResponseEvent;
        ProductsEventhandler.responseCache.del(requestId);
        complete(responseEvent.items);
      }
    });
  }

  private waitForMetaDataResponse(requestId: string): Promise<Product[]> {
    return PendingRequestHolder.holdConnection((complete, abort) => {
      if (ProductsEventhandler.responseCache.has(requestId)) {
        const responseEvent = ProductsEventhandler.responseCache.get(
          requestId,
        ) as GetMetadatResponseEvent;
        ProductsEventhandler.responseCache.del(requestId);

        complete(responseEvent.products);
      }
    });
  }
}
