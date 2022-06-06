import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";
import ProductDetails from "../../../components/product/ProductDetails";

//URL: /search/product/{id}

const SearchProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <BackablePageWithNavBar isLoginProtected={false} title="">
      <ProductDetails id={id as string} />
    </BackablePageWithNavBar>
  );
};

export default SearchProductDetailsPage;
