import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import TableBrand from "../components/Tables/TableBrand";

import { Metadata } from "next";
import DefaultLayout from "../components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Collably Tables Page | Collably - Collably Dashboard Kit",
  description: "This is Collably Tables page for Collably Dashboard Kit",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableBrand />
      
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
