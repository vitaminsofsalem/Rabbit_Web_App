import { CategoryProducts } from "../get-home.dto";

export class GetHomeRequestEvent {
  type: "GET_HOME_REQUEST";
}

export class GetHomeResponseEvent {
  type: "GET_HOME_RESPONSE";
  items: CategoryProducts[];
}
