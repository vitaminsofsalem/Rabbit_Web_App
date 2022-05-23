export class GetFavoritesRequestEvent {
  type: "GET_FAVORITES_REQUEST";
  email: string;
}

export class GetFavoritesResponseEvent {
  type: "GET_FAVORITES_RESPONSE";
  email: string;
  favorites: string[];
}

export class AddFavoriteEvent {
  type: "ADD_FAVORITE";
  productId: string;
  email: string;
}

export class RemoveFavoriteEvent {
  type: "REMOVE_FAVORITE";
  productId: string;
  email: string;
}
