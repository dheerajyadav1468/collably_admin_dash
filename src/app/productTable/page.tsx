"use client"

import { useState } from "react"

import ECommerce from "../../components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";
import React from "react";
import Head from "next/head";
import PanelNavigation from "../../components/DataStats/cardTwo"
import ProductsTable from '../../components/Tables/productTable'



export default function Home() {

  const [activePanel, setActivePanel] = useState<"customer" | "brand">("brand")

  const handlePanelChange = (panel: "customer" | "brand") => {
    setActivePanel(panel)
  }

  return (
    <>
     
      <DefaultLayoutBrand>
                <PanelNavigation activePanel={activePanel} onPanelChange={handlePanelChange} />
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