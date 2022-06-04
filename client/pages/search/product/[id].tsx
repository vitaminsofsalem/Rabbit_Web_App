import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";

//URL: /search/product/{id}

const SearchProductDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <BackablePageWithNavBar isLoginProtected={false} title="Title Here">
      <div></div>
    </BackablePageWithNavBar>
  );
};

export default SearchProductDetailsPage;
