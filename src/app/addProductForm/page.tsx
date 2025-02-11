"use client"; 

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ProductForm from "../../components/ProfileBox/productForm";
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand";

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

const TablesPage = () => {
  const handleSubmit = (formData: ProductFormData) => {
    console.log("Product Submitted:", formData);
  };

  return (
    <DefaultLayoutBrand>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </DefaultLayoutBrand>
  );
};

export default TablesPage;
