import styles from "../../styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
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

function divideToPages<T>(list: T[], maxEntries: number) {
  const numPages = Math.ceil(list.length / maxEntries);
  let pages: T[][] = [];

  for (let i = 0; i < numPages; i++) {
    pages.push([]);
    for (let j = 0; j < maxEntries; j++) {
      if (i * numPages * j >= list.length) break;
      pages[i].push(list[i * numPages + j]);
    }
  }

  return pages;
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

const SpecialCategoriesPager = (props: { items: CategoryItem[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const entriesContainerRef = useRef(null);
  const maxEntries = 2; //it is set to a constant value for now

  if (props.items.length == 0) {
    let entries = [];
    for (let i = 0; i < maxEntries; i++)
      entries.push(<div key={i} className={styles.itemLoading}></div>);

    return (
      <div
        ref={entriesContainerRef}
        className={styles.categoryPagerEntriesContainer}
      >
        {entries}
        <div className={styles.itemLoading}></div>
        <div className={styles.itemLoading}></div>
      </div>
    );
  }

  const numPages = Math.ceil(props.items.length / maxEntries);
  let pages: CategoryItem[][] = divideToPages<CategoryItem>(
    props.items,
    maxEntries
  );

  return (
    <>
      <CategoryPagerButton
        direction="prev"
        action={() => setCurrentPage(Math.max(currentPage - 1, 0))}
      />
      <div className={styles.categoryPagerEntriesContainer}>
        {pages[currentPage].map((item) => (
          <div
            className={styles.item}
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            <p>{item.title}</p>
          </div>
        ))}
      </div>
      <CategoryPagerButton
        direction="next"
        action={() => setCurrentPage(Math.min(currentPage + 1, numPages - 1))}
      />
    </>
  );
};

const CategoryPagerButton = (props: ArrowComponentProps) => {
  return (
    <div className={styles.buttonContainer}>
      <div
        onClick={props.action}
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
};

const SpecialCategories = () => {
  const [items, setItems] = useState<CategoryItem[]>([]);

  useEffect(() => {
    loadDummyData().then((item) => setItems(item)); //simulate loading process, for UI Testing only
  }, []);
  return (
    <div className={styles.specialCategories}>
      <SpecialCategoriesPager items={items} />
    </div>
  );
};

export default SpecialCategories;
