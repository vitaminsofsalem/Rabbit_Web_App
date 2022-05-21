import type { NextPage } from "next";
import { useRouter } from "next/router";

//URL: /search/product/{id}

const SearchProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div />;
};

export default SearchProductDetailsPage;
