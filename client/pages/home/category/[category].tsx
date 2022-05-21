import type { NextPage } from "next";
import { useRouter } from "next/router";

//URL: /home/category/{category}

const CategoryDetailsPage: NextPage = () => {
  const router = useRouter();
  const { category } = router.query;

  return <div />;
};

export default CategoryDetailsPage;
