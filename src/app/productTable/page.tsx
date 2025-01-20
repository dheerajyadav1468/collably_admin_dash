import ECommerce from "../../components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";
import React from "react";
import Head from "next/head";
import PanelNavigation from "../../components/DataStats/cardTwo"
import ProductsTable from '../../components/Tables/productTable'


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
        
        {/* <ChartTwo /> */}
        {/* <ChartThree /> */}
        <main className="flex mt-3 gap-5">
      <ProductsTable/>
        </main>
       
      </DefaultLayoutBrand>
      
    </>
  );
}