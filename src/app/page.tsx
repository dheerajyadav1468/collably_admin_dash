import ECommerce from "../components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "../components/Layouts/DefaultLaout";
import React from "react";
import Head from "next/head";
export const metadata: Metadata = {
  title:
    "Collably",
  description: "Collably Home page",
};

export default function Home() {
  return (
    <>
     <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
