"use client";

import React from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ExportProductsPage from "../../components/Tables/exportprod";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";

const BrandPage = () => {
  return (
    <DefaultLayoutBrand>
      <Breadcrumb pageName="Brand Management" />

      <div className="flex flex-col gap-10">
       
      <ExportProductsPage/>
      </div>
    </DefaultLayoutBrand>
  );
};

export default BrandPage;