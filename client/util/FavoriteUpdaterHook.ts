import { useRouter } from "next/router";
import { useContext } from "react";
import { GlobalStateContext } from "../model/GlobalState";
import { Product } from "../model/Product";
import { addFavorite, deleteFavorite } from "../remote/user";

type FavoriteUpdater = {
  toggleFavorite: (product: Product) => void;
  getIsFavorite: (product: Product) => boolean;
};

export function useFavoriteUpdater(): FavoriteUpdater {
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  const currentFavorites = globalState.favorites;
  const router = useRouter();

  const toggleFavorite = (product: Product) => {
    if (!globalState.isLoggedIn) {
      router.replace("/home/auth/send");
    }
    const newFavorites = [...currentFavorites];
    let handled = false;
    for (let i = 0; i < newFavorites.length; i++) {
      const item = newFavorites[i];
      if (item === product.id) {
        newFavorites.splice(i, 1);
        handled = true;
        deleteFavorite(product.id);
        break;
      }
    }

    if (!handled) {
      //if not handled, then should add
      newFavorites.push(product.id);
      addFavorite(product.id);
    }
    setGlobalState({ ...globalState, favorites: newFavorites });
  };

  const getIsFavorite = (product: Product) => {
    return !!currentFavorites.find((item) => item === product.id);
  };

  return {
    toggleFavorite,
    getIsFavorite,
  };
}
