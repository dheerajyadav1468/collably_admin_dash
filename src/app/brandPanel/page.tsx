import ECommerce from "../../components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";
import React from "react";
import Head from "next/head";
import DataStatsTwo from "../../components/DataStats/DataStatsTwo";
import PanelNavigation from "../../components/DataStats/cardTwo"
import ChartTwo from "../../components/Charts/ChartTwo";
import ChartThree from "../../components/Charts/ChartThree";
import{ MostSoldProducts } from "../../components/Card/brandCardOne"
import{ MostSoldBrands } from "../../components/Card/brandCardTwo"
import{ PopularCustomer } from "../../components/Card/brandCardThree"


export const metadata: Metadata = {
  title:
    "Collably | Brand Dashboard",
  description: "Collably Home page",
};

export default function Home() {
  return (
    <>
     <Head>
     <title>{String(metadata.title)}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayoutBrand>
        < PanelNavigation/>
        {/* <ECommerce /> */}
        <DataStatsTwo />
        {/* <ChartTwo /> */}
        {/* <ChartThree /> */}
        <main className="flex mt-3 gap-5">
        <MostSoldProducts/>
        <MostSoldBrands/>
        </main>
        <PopularCustomer/>
      </DefaultLayoutBrand>
      
    </>
  );
}