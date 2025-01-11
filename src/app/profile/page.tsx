import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "../components/Layouts/DefaultLaout";
import ProfileBox from "../components/ProfileBox";

export const metadata: Metadata = {
  title: "Collably Profile Page | Collably - Collably Dashboard Kit",
  description: "This is Collably Profile page for Collably Dashboard Kit",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />

        <ProfileBox />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
