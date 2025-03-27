"use client"


import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import BrandReferralTable  from "../../components/Tables/referalTableBrand";

// import { Metadata } from "next";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";

// export const metadata: Metadata = {
//   title: "Collably Tables Page | Collably - Collably Dashboard Kit",
//   description: "This is Collably Tables page for Collably Dashboard Kit",
// };

const TablesPage = () => {
  return (
    <DefaultLayoutBrand>
      <Breadcrumb pageName="Affiliate Tracking" />

      <div className="flex flex-col gap-10">
        {/* <TableOne /> */}
        <BrandReferralTable/>
      
      </div>
    </DefaultLayoutBrand>
  );
};

export default TablesPage;