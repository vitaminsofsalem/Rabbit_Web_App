import styles from "../../styles/Home.module.scss";
import { useEffect, useState } from "react";
import dummyData from "../../dummyData/specialCategories.json";

interface CategoryItem {
  title: String;
  imageUrl: String;
  backgroundColor?: String;
}

interface SpecialCategoriesProps {
  items: CategoryItem[];
}

interface ArrowComponentProps {
  direction: "next" | "prev";
  action?: () => void;
}

const loadDummyData: () => Promise<CategoryItem[]> = async () => {
  let items: CategoryItem[] = [];

  for (const item of dummyData) {
    const res = await fetch(item.imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    items.push({ title: item.title, imageUrl: url });
  }

  return items;
};

const SpecialCategoriesPager = (props: SpecialCategoriesProps) => {
  if (props.items.length == 0) {
    return (
      <div className={styles.categoryPagerEntriesContainer}>
        <div className={styles.itemLoading}></div>
        <div className={styles.itemLoading}></div>
        <div className={styles.itemLoading}></div>
      </div>
    );
  }

  return (
    <div className={styles.categoryPagerEntriesContainer}>
      {props.items.map((item) => (
        <div
          className={styles.item}
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        >
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

const CategoryPagerButton = (props: ArrowComponentProps) => (
  <div className={styles.buttonContainer}>
    <div
      className={
        props.direction == "next"
          ? styles.categoryPagerNextIcon
          : styles.categoryPagerPrevIcon
      }
    >
      <div className={styles.arrow}> </div>
    </div>
  </div>
);

const SpecialCategories = () => {
  const [items, setItems] = useState<CategoryItem[]>([]);

  useEffect(() => {
    loadDummyData().then((item) => setItems(item)); //simulate loading process, for UI Testing only
  }, []);
  return (
    <div className={styles.specialCategories}>
      <CategoryPagerButton direction="prev" />
      <SpecialCategoriesPager items={items} />
      <CategoryPagerButton direction="next" />
    </div>
  );
};

export default SpecialCategories;
