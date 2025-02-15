import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "../../components/Layouts/DefaultLaout";
import OrderDetails from "../../components/ProfileBox/orderDetails";

export const metadata: Metadata = {
  title: "Collably Profile Page | Collably - Collably Dashboard Kit",
  description: "This is Collably Profile page for Collably Dashboard Kit",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="">
        <Breadcrumb pageName="Profile" />

        <OrderDetails />
      </div>
    </DefaultLayout>
  );
};

export default Profile;

