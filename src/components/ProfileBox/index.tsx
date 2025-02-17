"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { CREATOR } from "../../types/creator";

const ProfileBox = () => {
  const [creator, setCreator] = useState<CREATOR | null>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<any[]>([]); 
  const searchParams = useSearchParams();

  useEffect(() => {
    const creatorName = searchParams.get('creator');
    const creatorLogo = searchParams.get('logo');
    const creatorVisitors = searchParams.get('visitors');
    const creatorRevenues = searchParams.get('revenues');
    const creatorSales = searchParams.get('sales');
    
    if (creatorName && creatorLogo && creatorVisitors && creatorRevenues && creatorSales) {
      const mockCreator = {
        logo: creatorLogo,
        name: creatorName,
        visitors: parseFloat(creatorVisitors),  
        revenues: creatorRevenues,
        sales: parseInt(creatorSales), 
        conversion: 4.8,
      };
      setCreator(mockCreator);
    }

    // Mock post data (images and videos)
    const mockPosts = [
      { id: 1, type: "image", src: "/images/creator/kiara.jpeg", caption: "Beautiful sunset!" },
      { id: 2, type: "video", src: "/videos/post-2.mp4", caption: "My morning workout!" },
      { id: 3, type: "image", src: "/images/creator/kiara.jpeg", caption: "Exploring the mountains." },
      { id: 4, type: "video", src: "/videos/post-4.mp4", caption: "A day at the beach!" }
    ];
    setPosts(mockPosts);
  }, [searchParams]);

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src="/images/cover/cover-01.png"
          alt="profile cover"
          className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={260}
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      {/* Profile picture and basic info */}
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
          <div className="relative drop-shadow-2">
            <Image
              src={creator ? creator.logo : "/images/user/user-03.png"}
              width={160}
              height={160}
              className="overflow-hidden rounded-full"
              alt="profile"
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="mb-1.5 text-2xl font-semibold text-dark dark:text-white">
            {creator ? creator.name : 'Creator Name'}
          </h3>
          <p className="font-medium">Content Creator</p>            
          <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-dark-3 dark:bg-dark-2">
            <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3">
              <span className="font-semibold text-dark dark:text-white">
                {creator ? creator.visitors : '0'}K
              </span>
              <span className="text-sm">Visitors</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3">
              <span className="font-semibold text-dark dark:text-white">
                ${creator ? creator.revenues : '0'}
              </span>
              <span className="text-sm">Revenues</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-4">
              <span className="font-semibold text-dark dark:text-white">
                {creator ? creator.sales : '0'}
              </span>
              <span className="text-sm">Sales</span>
            </div>
          </div>

          <div className="mx-auto max-w-180">
            <h4 className="font-semibold text-dark dark:text-white">
              About Me
            </h4>
            <p className="mt-4.5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque posuere fermentum urna, eu condimentum mauris
              tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
              ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
              pharetra ligula sed, aliquam lacus.
            </p>
          </div>

          <div className="mt-6.5">
            <h4 className="mb-3.5 font-semibold text-dark dark:text-white">
              Follow me on
            </h4>
            <div className="flex items-center justify-center gap-3.5">
              <a
                href="#"
                className="hover:text-primary"
                aria-label="social-icon"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_30_966)">
                    <path
                      d="M12.8333 12.375H15.125L16.0416 8.70838H12.8333V6.87504C12.8333 5.93088 12.8333 5.04171 14.6666 5.04171H16.0416V1.96171C15.7428 1.92229 14.6144 1.83337 13.4227 1.83337C10.934 1.83337 9.16663 3.35229 9.16663 6.14171V8.70838H6.41663V12.375H9.16663V20.1667H12.8333V12.375Z"
                      fill=""
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_30_966">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-primary"
                aria-label="social-icon"
              >
                <svg
                  className="fill-current"
                  width="23"
                  height="22"
                  viewBox="0 0 23 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_30_970)">
                    <path
                      d="M20.9813 5.18472C20.2815 5.49427 19.5393 5.69757 18.7795 5.78789C19.5804 5.30887 20.1798 4.55498 20.4661 3.66672C19.7145 4.11405 18.8904 4.42755 18.0315 4.59714C17.4545 3.97984 16.6898 3.57044 15.8562 3.43259C15.0225 3.29474 14.1667 3.43617 13.4218 3.83489C12.6768 4.2336 12.0845 4.86726 11.7368 5.63736C11.3891 6.40746 11.3056 7.27085 11.4993 8.0933C9.97497 8.0169 8.48376 7.62078 7.12247 6.93066C5.76118 6.24054 4.56024 5.27185 3.59762 4.08747C3.25689 4.67272 3.07783 5.33801 3.07879 6.01522C3.07879 7.34439 3.75529 8.51864 4.78379 9.20614C4.17513 9.18697 3.57987 9.0226 3.04762 8.72672V8.77439C3.04781 9.78394 3.3374 10.7384 3.85987 11.3593C4.38798 12.0006 5.118 12.4074 5.94217 12.5914C5.06189 13.0845 4.04918 13.2228 3.04287 13.0156C4.38715 14.3347 5.99421 14.9922 7.73213 14.9922C11.532 14.9922 14.3666 13.1781 14.3666 10.6469C14.3666 10.4166 14.3491 10.1882 14.313 9.96365C14.8919 9.73939 15.4199 9.41111 15.8039 8.97117C16.1878 8.53122 16.4099 7.99983 16.4356 7.45227C16.4613 6.9047 16.2894 6.36761 15.9497 5.95419C15.5957 5.52749 14.9152 5.34721 14.2997 5.53072C14.2018 5.5425 14.0803 5.5586 13.9518 5.57357C13.4676 5.6947 13.0211 5.80166 12.5387 5.87429C12.0563 5.94693 11.5635 5.98347 11.0731 5.9801C10.5827 5.97673 10.0953 5.93339 9.61642 5.85395C9.13752 5.77451 8.67145 5.66962 8.22198 5.5419C7.77251 5.41418 7.33972 5.26394 6.92556 5.09569C6.5114 4.92744 6.11706 4.73113 5.75204 4.51311C5.38702 4.29509 5.05119 4.05679 4.7519 3.80457C4.45261 3.55235 4.20551 3.28478 4.01557 2.99818C3.82562 2.71157 3.69432 2.40424 3.60759 2.08568C3.47992 1.61013 3.31385 1.14459 3.0863 0.724537C2.85874 0.304487 2.56277 0.0202811 2.23494 0.0266487C1.86199 0.0167927 1.50448 0.194835 1.27658 0.552795C1.04868 0.910755 0.963205 1.42492 1.04691 1.93813C1.13065 2.45134 1.37812 2.88951 1.7461 3.16044"
                      fill="#3B82F6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_30_970">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
