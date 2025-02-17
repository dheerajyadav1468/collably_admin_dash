"use client";

import React from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TableBrand from "../../components/Tables/TableBrand";
import DefaultLayout from "../../components/Layouts/DefaultLaout";
import BrandOnboardingForm from "../../components/ProfileBox/brandform";

const BrandPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Brand Management" />

      <div className="flex flex-col gap-10">
       
        <TableBrand />
      </div>
    </DefaultLayout>
  );
};

export default BrandPage;

