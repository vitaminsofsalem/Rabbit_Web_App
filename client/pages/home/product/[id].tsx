import type { NextPage } from "next";
import { useRouter } from "next/router";

//URL: /home/product/{id}

const HomeProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div />;
};

export default HomeProductDetailsPage;
