'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ECommerce from "../components/Dashboard/E-commerce";
import DefaultLayout from "../components/Layouts/DefaultLaout";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn");
    if (userLoggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Collably</title>
        <meta name="description" content="Collably Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoggedIn && (
        <DefaultLayout>
          <ECommerce />
        </DefaultLayout>
      )}
    </>
  );
}
