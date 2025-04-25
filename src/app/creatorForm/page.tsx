"use client"; // Ensure this is a client component

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CreatorOnboardingForm from '../../components/ProfileBox/creatorform';
import { Metadata } from "next";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

type CreatorFormData = {
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

  const handleFormSubmit = (formData: any) => {
    console.log('Form submitted with data:', formData);
  };

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
      <CreatorOnboardingForm  />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;

