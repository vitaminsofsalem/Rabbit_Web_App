import { Category } from "../get-categories.dto";

export class GetCategoriesRequestEvent {
  type: "GET_CATEGORIES_REQUEST";
}

export class GetCategoriesResponseEvent {
  type: "GET_CATEGORIES_RESPONSE";
  categories: string[];
}
