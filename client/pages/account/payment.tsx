import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { PageWithNavBar } from "../../components/page_containers/PageWithNavBar";
import { verifyPayment } from "../../remote/payments";

const PaymentHandler: NextPage = () => {
  const router = useRouter();
  const { session_id, order_id } = router.query;

  useEffect(() => {
    if (session_id && order_id) {
      verifyPayment(order_id as string, {
        paymentId: session_id as string,
      }).then(() => {
        setTimeout(() => {
          router.replace("/account/orders/" + order_id);
        }, 5000);
      });
    }
  }, [session_id, order_id]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <p>Sending payment result</p>
    </div>
  );
};

export default PaymentHandler;
