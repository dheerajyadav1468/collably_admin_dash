import Image from "next/image";

const referralData = [
  {
    user: "John Doe",
    link: "https://example1.com",
    clicks: 1200,
    postId: "A123",
  },
  {
    user: "Jane Smith",
    link: "https://example2.com",
    clicks: 890,
    postId: "B456",
  },
  {
    user: "Alice Brown",
    link: "https://example3.com",
    clicks: 700,
    postId: "C789",
  },
  {
    user: "Bob White",
    link: "https://example4.com",
    clicks: 560,
    postId: "D012",
  },
];

const ReferalTable = () => {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Top Channels
      </h4> */}

      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-4">
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              User
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Link
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Clicks
            </h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Post ID
            </h5>
          </div>
        </div>

        {/* Loop through the referralData array to dynamically populate the table */}
        {referralData.map((brand, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              key === referralData.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={key}
          >

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{brand.user}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                <a href={brand.link} target="_blank" rel="noopener noreferrer">
                  {brand.link}
                </a>
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{brand.clicks}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{brand.postId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferalTable;
