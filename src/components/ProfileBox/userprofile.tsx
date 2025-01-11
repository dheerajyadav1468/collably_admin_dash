'use client';

import { useSearchParams } from 'next/navigation';
import TableFour from "@/components/Tables/TableFour";

const ProfileUser = () => {
  const searchParams = useSearchParams();

  const userId = searchParams.get('userId') || 'Unknown';
  const userName = searchParams.get('name') || 'Unknown';
  const userEmail = searchParams.get('email') || 'Unknown';
  const userPhone = searchParams.get('phone') || 'Unknown';
  const registrationDate = searchParams.get('registrationDate') || 'Unknown';

  return (
    <div className="p-6 bg-white dark:bg-gray-dark rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-dark dark:text-white">
        User Details -  {userName}
      </h2>
      <div className="usercover">
        <p className="text-lg text-dark dark:text-gray-300">
          <strong>User ID:</strong> {userId}
        </p>
        <p className="text-lg text-dark dark:text-gray-300">
          <strong>Name:</strong> {userName}
        </p>
        <p className="text-lg text-dark dark:text-gray-300">
          <strong>Email:</strong> {userEmail}
        </p>
        <p className="text-lg text-dark dark:text-gray-300">
          <strong>Phone:</strong> {userPhone}
        </p>
        <p className="text-lg text-dark dark:text-gray-300">
          <strong>Registration Date:</strong> {registrationDate}
        </p>
      </div>
      <TableFour />
    </div>
  );
};

export default ProfileUser;
