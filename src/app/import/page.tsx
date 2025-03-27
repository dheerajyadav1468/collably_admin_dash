"use client";

import React from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ImportProductsPage from "../../components/Tables/importprod";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";

const BrandPage = () => {
  return (
    <DefaultLayoutBrand>
      <Breadcrumb pageName="Brand Management" />

      <div className="flex flex-col gap-10">
       
      <ImportProductsPage/>
      </div>
    </DefaultLayoutBrand>
  );
};

export default BrandPage;