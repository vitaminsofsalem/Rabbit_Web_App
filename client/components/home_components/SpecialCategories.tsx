import styles from "../../styles/Home.module.scss";

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

const SpecialCategoriesPager = () => (
  <div className={styles.categoryPagerEntriesContainer}></div>
);

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

const SpecialCategories = () => (
  <div className={styles.specialCategories}>
    <CategoryPagerButton direction="prev" />
    <SpecialCategoriesPager />
    <CategoryPagerButton direction="next" />
  </div>
);

export default SpecialCategories;
