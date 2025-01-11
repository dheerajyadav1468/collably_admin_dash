import Image from "next/image";
import { purchaseProduct } from "../types/purchaseProduct";
import { useSearchParams } from 'next/navigation';


const productData: purchaseProduct[] = [
    {
      image: "/images/product/product-01.png",
      name: "Apple Watch Series 7",
      creator: "Kiara Advani",
      quantity: 3,
      amount: 276,
      purchaseDate: "22-01-2024",
    },
    {
      image: "/images/product/product-02.png",
      name: "Macbook Pro M1",
      creator: "NA",
      quantity: 2,
      amount: 546,
      purchaseDate: "12-02-2021",
    },
    {
      image: "/images/product/product-03.png",
      name: "Dell Inspiron 15",
      creator: "Sidharth Malhotra",
      quantity: 2,
      amount: 443,
      purchaseDate: "4-09-2023",
    },
    {
      image: "/images/product/product-04.png",
      name: "HP Probook 450",
      creator: "NA",
      quantity: 1,
      amount: 499,
      purchaseDate: "13-09-2022",
    },
  ];
  

const TableFour = () => {

    const searchParams = useSearchParams();
    const userName = searchParams.get('name') || 'Unknown';
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-4 py-6 md:px-6 xl:px-9">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Products Purchased by {userName}
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Referral</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Quantity</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Amount</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Purchase Date</p>
        </div>
      </div>

      {productData.map((purchasePproduct,key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <Image
                  src={purchasePproduct.image}
                  width={60}
                  height={50}
                  alt="Product"
                />
              </div>
              <p className="text-body-sm font-medium text-dark dark:text-dark-6">
                {purchasePproduct.name}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-body-sm font-medium text-green">
              {purchasePproduct.creator}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {purchasePproduct.quantity}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {purchasePproduct.amount}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark  dark:text-dark-6">
              {purchasePproduct.purchaseDate}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableFour;
