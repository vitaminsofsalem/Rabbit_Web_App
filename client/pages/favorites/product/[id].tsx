import type { NextPage } from "next";
import { useRouter } from "next/router";

//URL: /favorites/product/{id}

const FavoriteProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div />;
};

export default FavoriteProductDetailsPage;
