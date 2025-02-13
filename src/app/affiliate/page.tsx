import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ReferalTable  from "../../components/Tables/referalTable";

import { Metadata } from "next";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Collably Tables Page | Collably - Collably Dashboard Kit",
  description: "This is Collably Tables page for Collably Dashboard Kit",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Affiliate Tracking" />

      <div className="flex flex-col gap-10">
        {/* <TableOne /> */}
        <ReferalTable/>
      
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;