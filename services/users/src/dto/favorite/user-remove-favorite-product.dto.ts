export default class UserRemoveFavoriteProductEvent {
  type: "REMOVE_FAVORITE";
  email: string;
  productId: string;
}
