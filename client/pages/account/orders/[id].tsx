import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BackablePageWithNavBar } from "../../../components/page_containers/BackablePageWithNavBar";

//URL: /account/orders/{id}

const OrderDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <BackablePageWithNavBar title="Title Here">
      <div></div>
    </BackablePageWithNavBar>
  );
};

export default OrderDetailsPage;
