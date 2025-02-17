"use client";

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ProductForm from "../../components/ProfileBox/productForm";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
        <ProductForm />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
