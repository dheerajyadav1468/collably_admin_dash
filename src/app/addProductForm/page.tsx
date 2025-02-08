"use client"; 

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ProductForm from "../../components/ProfileBox/productForm";
import { Metadata } from "next";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";
// import ProductsTable from '../../components/Tables/productTable'

type ProductFormData = {
  name: string;
    brandLogo: File | null;
    brandname: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    status: string;
  };

const handleSubmit = (formData: ProductFormData) => {
  console.log(formData);
};

const TablesPage = () => {
  return (
    <DefaultLayoutBrand>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
        <ProductForm onSubmit={handleSubmit} />
        {/* <ProductsTable/> */}
      </div>
    </DefaultLayoutBrand>
  );
};

export default TablesPage;
