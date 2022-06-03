import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";

//URL: /home/product/{id}

const HomeProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <BackablePageWithNavBar title="Title Here">
      <div></div>
    </BackablePageWithNavBar>
  );
};

export default HomeProductDetailsPage;
