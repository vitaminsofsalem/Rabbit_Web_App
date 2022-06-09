import type { NextPage } from "next";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import ProductGrid from "../../components/product/ProductGrid";
import styles from "../../styles/Search.module.scss";
import { useState } from "react";
import { searchProducts } from "../../remote/product";
import { toast } from "react-toastify";
import { Product } from "../../model/Product";

//URL: /search

const SearchPage: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchItems, setSearchItems] = useState<Product[]>([]);

  const handleSearch = () => {
    toast
      .promise(searchProducts(searchValue), {
        pending: "Getting Items",
        error: "Failed to get Items",
      })
      .then((searchResult) => {
        setSearchItems(searchResult.products);
      });
  };
  return (
    <PageWithNavBar isLoginProtected={false}>
      {/* Use this component to show the grid
      <ProductGrid products={products} source="search" /> */}
      <div className={styles.searchContainer}>
        <div className={styles.header}>
          <div className={styles.inputField}>
            <input
              className={styles.searchBar}
              type="text"
              placeholder="Enter Search Term"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSearch();
              }}
            ></input>
          </div>
        </div>
        <div className={styles.itemGrid}>
          <ProductGrid products={searchItems} source="search" />
        </div>
      </div>
    </PageWithNavBar>
  );
};

export default SearchPage;
