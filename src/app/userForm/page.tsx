"use client";

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import UserForm from "../../components/ProfileBox/userform";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="User Form" />
      <div className="flex flex-col gap-10">
        <UserForm />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
