"use client";

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import BlogForm from "../../components/ProfileBox/blogForm";
import DefaultLayout from "../../components/Layouts/DefaultLaout";

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />
      <div className="flex flex-col gap-10">
        <BlogForm />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
