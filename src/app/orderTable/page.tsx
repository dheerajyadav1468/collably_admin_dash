"use client";

import React from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import OrderTable from "../../components/Tables/orderTable";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

const BrandPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Brand Management" />

      <div className="flex flex-col gap-10">
       
      <OrderTable/>
      </div>
    </DefaultLayout>
  );
};

export default BrandPage;