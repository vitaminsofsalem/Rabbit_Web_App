import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import ProductDetails from "../../../components/product/ProductDetails";

//URL: /favorites/product/{id}

const FavoriteProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <BackablePageWithNavBar title="">
      <ProductDetails id={id as string} />
    </BackablePageWithNavBar>
  );
};

export default FavoriteProductDetailsPage;
