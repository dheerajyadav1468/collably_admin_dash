"use client";

import { useState } from "react";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";
import DataStatsTwo from "../../components/DataStats/DataStatsTwo";
import PanelNavigation from "../../components/DataStats/cardTwo"; // Corrected import
import { MostSoldProducts } from "../../components/Card/brandCardOne";
import { MostSoldBrands } from "../../components/Card/brandCardTwo";
import { PopularCustomer } from "../../components/Card/brandCardThree";

export default function Home() {
  const [activePanel, setActivePanel] = useState<"customer" | "brand">("brand");

  const handlePanelChange = (panel: "customer" | "brand") => {
    setActivePanel(panel);
  };

  return (
    <DefaultLayoutBrand>
      <PanelNavigation activePanel={activePanel} onPanelChange={handlePanelChange} />
      <DataStatsTwo />
      <main className="flex mt-3 gap-5">
        <MostSoldProducts />
        <MostSoldBrands />
      </main>
      <PopularCustomer />
    </DefaultLayoutBrand>
  );
}
