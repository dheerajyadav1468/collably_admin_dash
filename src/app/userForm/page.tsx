"use client"; 

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import UserForm from "../../components/ProfileBox/userform";
import { Metadata } from "next";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

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
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
        <UserForm onSubmit={handleSubmit} />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
