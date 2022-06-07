import styles from "../../styles/Home.module.scss";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import useWidth from "../../util/WidthHook";
import { mapCategoryToLabel } from "../../util/CategoryMapper";
import { useRouter } from "next/router";

interface SpecialCategoriesProps {
  items: string[];
}

interface ArrowComponentProps {
  direction: "next" | "prev";
  action?: () => void;
}

function divideToPages<T>(list: T[], maxEntries: number) {
  const remainingItems = [...list];
  const numPages = Math.ceil(list.length / maxEntries);
  let pages: T[][] = [];

  for (let i = 0; i < numPages; i++) {
    if (remainingItems.length === 0) break;
    pages.push([]);
    for (let j = 0; j < maxEntries; j++) {
      if (remainingItems.length === 0) break;

      pages[i].push(remainingItems[0]);
      remainingItems.splice(0, 1);
    }
  }

  return pages;
}

const SpecialCategoriesPager = (props: SpecialCategoriesProps) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const entriesContainerRef = useRef<HTMLDivElement>(null);

  const elementWidth = useWidth(entriesContainerRef);
  const maxEntries = elementWidth / 190;
  const router = useRouter();

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
  let pages: string[][] = divideToPages<string>(props.items, maxEntries);

  return (
    <>
      <CategoryPagerButton
        direction="prev"
        action={() => setCurrentPage(Math.max(currentPage - 1, 0))}
      />
      <div
        ref={entriesContainerRef}
        className={styles.categoryPagerEntriesContainer}
      >
        {pages[currentPage].map((item) => (
          <div
            onClick={() => {
              router.push("/home/category/" + item);
            }}
            className={styles.item}
          >
            <p>{mapCategoryToLabel(item)}</p>
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

const SpecialCategories: React.FC<SpecialCategoriesProps> = (props) => {
  return (
    <div className={styles.specialCategories}>
      <SpecialCategoriesPager items={props.items} />
    </div>
  );
};

export default SpecialCategories;
