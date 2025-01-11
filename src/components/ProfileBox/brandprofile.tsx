'use client';

import { useSearchParams } from 'next/navigation';
import TableTwo from "../../components/Tables/TableTwo";

const ProfileBrand = () => {
  const searchParams = useSearchParams();

  const brandName = searchParams.get('brand') || 'Unknown';
  const brandLogo = searchParams.get('logo') || '';
  const brandProducts = searchParams.get('products') || '0';
  const brandRevenues = searchParams.get('revenues') || '0';
  const brandSales = searchParams.get('sales') || '0';

  return (
    <div className="p-6 bg-white dark:bg-gray-dark rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-dark dark:text-white">
        {brandName} - Brand Details
      </h2>
      <div className='brandcover'>
      <img src={brandLogo} alt={brandName} className="mb-4 w-24 h-24" />
      <div>
      <p className="text-lg text-dark dark:text-gray-300">
        <strong>Products:</strong> {brandProducts}
      </p>
      <p className="text-lg text-dark dark:text-gray-300">
        <strong>Revenues:</strong> ₹{brandRevenues}
      </p>
      <p className="text-lg text-dark dark:text-gray-300">
        <strong>Sales:</strong> {brandSales}
        
      </p>
      </div>
      </div>
      <TableTwo />
    </div>
    
  );
};

export default ProfileBrand;
