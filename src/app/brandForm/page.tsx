"use client"; 

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import BrandOnboardingForm from "../../components/ProfileBox/brandform";
import { Metadata } from "next";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

type BrandFormData = {
    brandName: string;
    brandLogo: File | null;
    brandDescription: string;
    brandCategory: string;
    contactEmail: string;
    brandWebsite: string;
    brandPhone: string;
    socialMediaLinks: string;
    gstNumber: string;
  };

const handleSubmit = (formData: BrandFormData) => {
  console.log(formData);
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
        <BrandOnboardingForm onSubmit={handleSubmit} />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
