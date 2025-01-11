import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "../../components/Layouts/DefaultLaout";
import ProfileBrand from "../../components/ProfileBox/brandprofile";

export const metadata: Metadata = {
  title: "Collably Profile Page | Collably - Collably Dashboard Kit",
  description: "This is Collably Profile page for Collably Dashboard Kit",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />

        <ProfileBrand />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
