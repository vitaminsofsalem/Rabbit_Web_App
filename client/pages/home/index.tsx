import type { NextPage } from "next";
import CategoryProducts from "../../components/home_components/CategoryProducts";
import SpecialCategories from "../../components/home_components/SpecialCategories";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import styles from "../../styles/Home.module.scss";
import { mapCategoryToLabel } from "../../util/CategoryMapper";
import { useEffect, useState } from "react";
import { Product } from "../../model/Product";
import { getCategories, getHomeProducts } from "../../remote/product";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

//URL: /home

const HomePage: NextPage = () => {
  const colors = ["#4d21d1", "#F12250", "#32c97e", "#4287f5", "#c93232"];
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>([]);
  const [homeItems, setHomeItems] = useState<
    {
      category: string;
      products: Product[];
    }[]
  >();

  useEffect(() => {
    toast
      .promise(getCategories(), {
        pending: "Getting categories",
        error: "Failed to get categories",
      })
      .then((categoriesResult) => {
        setCategories(
          categoriesResult.categories.map((item) => mapCategoryToLabel(item))
        );
      });
  }, []);

  useEffect(() => {
    toast
      .promise(getHomeProducts(), {
        pending: "Getting products",
        error: "Failed to get products",
      })
      .then((homeItemResult) => {
        setHomeItems(homeItemResult.items);
      });
  }, []);

  return (
    <PageWithNavBar isLoginProtected={false} isFlex={false}>
      <div className={styles.homeContainer}>
        <SpecialCategories items={categories} />
        {homeItems?.map((item, index) => (
          <CategoryProducts
            color={colors[index % 5]}
            products={item.products}
            title={item.category}
            onProductClick={(id) => router.push("/home/product/" + id)}
          />
        ))}
      </div>
    </PageWithNavBar>
  );
};

export default HomePage;
