import type { NextPage } from "next";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";

//URL: /search

const SearchPage: NextPage = () => {
  return (
    <PageWithNavBar isLoginProtected={false}>
      {/* Use this component to show the grid
      <ProductGrid products={products} source="search" /> */}

      <div></div>
    </PageWithNavBar>
  );
};

export default SearchPage;
