import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";

//URL: /home/category/{category}

const CategoryDetailsPage: NextPage = () => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <BackablePageWithNavBar title="Title Here">
      <div></div>
    </BackablePageWithNavBar>
  );
};

export default CategoryDetailsPage;
