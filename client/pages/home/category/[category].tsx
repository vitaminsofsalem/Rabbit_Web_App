import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import ProductGrid from "../../../components/product/ProductGrid";
import { Product } from "../../../model/Product";
import { getCategoryProducts } from "../../../remote/product";
import { mapCategoryToLabel } from "../../../util/CategoryMapper";

//URL: /home/category/{category}

const CategoryDetailsPage: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const { category } = router.query;

  useEffect(() => {
    toast
      .promise(getCategoryProducts(category as string), {
        pending: "Getting products",
        error: "Failed to get products",
      })
      .then((productsResult) => {
        setProducts(productsResult.products);
      });
  }, []);

  return (
    <BackablePageWithNavBar
      isLoginProtected={false}
      title={mapCategoryToLabel(category as string)}
    >
      <ProductGrid products={products} source="home" />
    </BackablePageWithNavBar>
  );
};

export default CategoryDetailsPage;
