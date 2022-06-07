import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import ProductGrid from "../../components/product/ProductGrid";
import { GlobalStateContext } from "../../model/GlobalState";
import { Product } from "../../model/Product";
import { getFavorites } from "../../remote/user";

//URL: /favorites

const FavoritesPage: NextPage = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    toast
      .promise(getFavorites(), {
        pending: "Getting favorites",
        error: "Failed to get favorites",
      })
      .then((favoritesResult) => {
        setFavorites(favoritesResult.favorites);
      });
  }, []);

  return (
    <PageWithNavBar>
      <ProductGrid products={favorites} source="favorites" />
    </PageWithNavBar>
  );
};

export default FavoritesPage;
