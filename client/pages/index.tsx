import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Index: NextPage = () => {
  const router = useRouter();

  //Redirect to home. No page here
  useEffect(() => {
    router.replace("/home");
  }, []);

  return <div />;
};

export default Index;
