import type { NextPage } from "next";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";

//URL: /search

const SearchPage: NextPage = () => {
  return (
    <PageWithNavBar isLoginProtected={false}>
      <div></div>
    </PageWithNavBar>
  );
};

export default SearchPage;
