"use client"; 

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ProductForm from "../../components/ProfileBox/productForm";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";

const TablesPage = () => {
  return (
    <DefaultLayoutBrand>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
        <ProductForm />
      </div>
    </DefaultLayoutBrand>
  );
};

export default TablesPage;
