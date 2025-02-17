import React from "react";
import FormElements from "../../../components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "../../../components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Collably Form Elements Page | Collably - Collably Dashboard Kit",
  description: "This is Collably Form Elements page for Collably Dashboard Kit",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <FormElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
