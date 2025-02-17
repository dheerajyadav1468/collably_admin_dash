"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ClickOutside from "../../components/ClickOutside"

const DropdownUser = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const role = localStorage.getItem("userRole")
    const name = role === "admin" 
      ? localStorage.getItem("userName") 
      : localStorage.getItem("userName")
      console.log(name);
    setIsLoggedIn(loggedIn)
    setUserRole(role)
    setUserName(name)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("fullname")
    localStorage.removeItem("brandName")
    setIsLoggedIn(false)
    setUserRole(null)
    setUserName(null)
    if (userRole === "admin") {
      router.push("/login")
    } else if (userRole === "brand") {
      router.push("/loginBrand")
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <ClickOutside onClickOutside={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={userRole === "admin" ? "/images/user/admin-avatar.png" : "/images/user/brand-avatar.png"}
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
            className="overflow-hidden rounded-full"
          />
        </span>

        <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6">
          <span className="hidden lg:block">{userName || (userRole === "admin" ? "Admin" : "Brand")}</span>

          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen ? "rotate-180" : ""}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
              fill=""
            />
          </svg>
        </span>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark`}
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <span className="relative block h-12 w-12 rounded-full">
              <Image
                width={112}
                height={112}
                src={userRole === "admin" ? "/images/user/admin-avatar.png" : "/images/user/brand-avatar.png"}
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
                className="overflow-hidden rounded-full"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark"></span>
            </span>

            <span className="block">
              <span className="block font-medium text-dark dark:text-white">
                {userName || (userRole === "admin" ? "Admin" : "Brand")}
              </span>
              <span className="block font-medium text-dark-5 dark:text-dark-6">
                {userRole === "admin" ? "Administrator" : "Brand Manager"}
              </span>
            </span>
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              <Link
                href={userRole === "admin" ? "/profile" : "/brandProfile"}
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.99998 0.9375C7.03246 0.9375 5.43748 2.53249 5.43748 4.5C5.43748 6.46751 7.03246 8.0625 8.99998 8.0625C10.9675 8.0625 12.5625 6.46751 12.5625 4.5C12.5625 2.53249 10.9675 0.9375 8.99998 0.9375ZM6.56248 4.5C6.56248 3.15381 7.65378 2.0625 8.99998 2.0625C10.3462 2.0625 11.4375 3.15381 11.4375 4.5C11.4375 5.84619 10.3462 6.9375 8.99998 6.9375C7.65378 6.9375 6.56248 5.84619 6.56248 4.5Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.99998 9.1875C7.26482 9.1875 5.66617 9.58191 4.48157 10.2483C3.31459 10.9047 2.43748 11.8995 2.43748 13.125L2.43743 13.2015C2.43658 14.0729 2.43552 15.1665 3.39479 15.9477C3.86689 16.3321 4.52734 16.6055 5.41964 16.7861C6.31442 16.9672 7.48065 17.0625 8.99998 17.0625C10.5193 17.0625 11.6855 16.9672 12.5803 16.7861C13.4726 16.6055 14.1331 16.3321 14.6052 15.9477C15.5644 15.1665 15.5634 14.0729 15.5625 13.2015L15.5625 13.125C15.5625 11.8995 14.6854 10.9047 13.5184 10.2483C12.3338 9.58191 10.7351 9.1875 8.99998 9.1875ZM3.56248 13.125C3.56248 12.4865 4.02851 11.7939 5.03311 11.2288C6.02008 10.6736 7.42143 10.3125 8.99998 10.3125C10.5785 10.3125 11.9799 10.6736 12.9668 11.2288C13.9714 11.7939 14.4375 12.4865 14.4375 13.125C14.4375 14.1059 14.4072 14.658 13.8948 15.0753C13.6169 15.3016 13.1523 15.5225 12.3571 15.6835C11.5644 15.8439 10.4806 15.9375 8.99998 15.9375C7.51931 15.9375 6.43553 15.8439 5.64282 15.6835C4.84762 15.5225 4.38307 15.3016 4.10517 15.0753C3.59271 14.658 3.56248 14.1059 3.56248 13.125Z"
                    fill=""
                  />
                </svg>
                View profile
              </Link>
            </li>

            <li>
              <Link
                href="/pages/settings"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 6.1875C7.4467 6.1875 6.1875 7.4467 6.1875 9C6.1875 10.5533 7.4467 11.8125 9 11.8125C10.5533 11.8125 11.8125 10.5533 11.8125 9C11.8125 7.4467 10.5533 6.1875 9 6.1875ZM7.3125 9C7.3125 8.06802 8.06802 7.3125 9 7.3125C9.93198 7.3125 10.6875 8.06802 10.6875 9C10.6875 9.93198 9.93198 10.6875 9 10.6875C8.06802 10.6875 7.3125 9.93198 7.3125 9Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.98106 0.9375C8.64771 0.937495 8.36943 0.93749 8.14097 0.953078C7.90315 0.969304 7.6785 1.00429 7.46071 1.0945C6.95534 1.30383 6.55382 1.70535 6.34449 2.21072C6.23551 2.47381 6.206 2.75109 6.19473 3.05247C6.18567 3.29474 6.0634 3.49688 5.88296 3.60106C5.70253 3.70523 5.46634 3.71005 5.252 3.59676C4.98535 3.45583 4.73046 3.34275 4.44812 3.30557C3.9058 3.23418 3.35732 3.38114 2.92334 3.71414C2.73632 3.85765 2.5937 4.0347 2.46074 4.23255C2.33301 4.42261 2.19387 4.66361 2.02721 4.9523L2.00826 4.98511C1.84159 5.27379 1.70245 5.51478 1.60172 5.72042C1.49686 5.9345 1.41483 6.14654 1.38406 6.38026C1.31266 6.92259 1.45963 7.47107 1.79262 7.90504C1.96596 8.13094 2.1913 8.29512 2.44663 8.45555C2.65196 8.58457 2.76591 8.79158 2.7659 8.99999C2.76589 9.20837 2.65194 9.41535 2.44663 9.54435C2.19127 9.7048 1.9659 9.86899 1.79255 10.0949C1.45955 10.5289 1.31259 11.0774 1.38399 11.6197C1.41476 11.8534 1.49678 12.0654 1.60164 12.2795C1.70237 12.4852 1.84151 12.7262 2.00818 13.0148L2.02713 13.0476C2.1938 13.3363 2.33294 13.5773 2.46067 13.7674C2.59363 13.9652 2.73625 14.1423 2.92327 14.2858C3.35724 14.6188 3.90572 14.7658 4.44805 14.6944C4.73038 14.6572 4.98525 14.5441 5.25188 14.4032C5.46625 14.2899 5.70247 14.2947 5.88293 14.3989C6.06339 14.5031 6.18567 14.7053 6.19473 14.9476C6.206 15.2489 6.23552 15.5262 6.34449 15.7893C6.55382 16.2947 6.95534 16.6962 7.46071 16.9055C7.6785 16.9957 7.90315 17.0307 8.14097 17.0469C8.36943 17.0625 8.64771 17.0625 8.98105 17.0625H9.01894C9.35228 17.0625 9.63056 17.0625 9.85902 17.0469C10.0968 17.0307 10.3215 16.9957 10.5393 16.9055C11.0446 16.6962 11.4462 16.2947 11.6555 15.7893C11.7645 15.5262 11.794 15.2489 11.8053 14.9475C11.8143 14.7052 11.9366 14.5031 12.117 14.3989C12.2975 14.2947 12.5337 14.2899 12.7481 14.4032C12.9625 14.5165 13.1174 14.6714 13.2037 14.8787C13.29 15.086 13.3149 15.3353 13.2777 15.5623C13.2405 15.7893 13.1467 16.0163 12.9681 16.1949C12.7895 16.3735 12.5125 16.4673 12.2032 16.4673C11.8935 16.4673 11.6427 16.3735 11.4641 16.1949C11.2855 16.0163 11.1917 15.7893 11.1545 15.5623C11.1173 15.3353 11.1422 15.086 11.2295 14.8787C11.3158 14.6714 11.4707 14.5165 11.6851 14.4032C11.8995 14.2899 12.1357 14.2947 12.3152 14.3989C12.4947 14.5031 12.617 14.7053 12.626 14.9476C12.635 15.2489 12.6645 15.5262 12.7735 15.7893C12.9828 16.2947 13.3843 16.6962 13.89 16.9055C14.1078 16.9957 14.3324 17.0307 14.5702 17.0469C14.7987 17.0625 15.077 17.0625 15.4103 17.0625C16.4868 17.0625 17.3135 16.1358 17.3135 14.9999C17.3135 13.864 16.4868 12.9373 15.4103 12.9373C14.577 12.9373 14.3324 12.9024 14.5702 12.8122C14.3324 12.722 14.1078 12.657 13.89 12.5662C13.3843 12.2569 12.9828 11.8554 12.7735 11.3508C12.6645 11.1138 12.635 10.7911 12.626 10.49C12.617 10.1894 12.4947 9.98728 12.3152 9.89209C12.1357 9.7969 11.8995 9.7969 11.6851 9.89209C11.4707 9.98728 11.3158 10.1894 11.2295 10.49C11.1422 10.7911 11.1173 11.1138 11.1545 11.3508C11.1917 11.5878 11.2855 11.8148 11.4641 11.9934C11.6427 12.172 11.8935 12.2658 12.2032 12.2658C12.5125 12.2658 12.7895 12.172 12.9681 11.9934C13.1467 11.8148 13.2405 11.5878 13.2777 11.3508C13.3149 11.1138 13.29 10.8645 13.2037 10.6572C13.1174 10.4499 12.9625 10.3049 12.7481 10.1916C12.5337 10.0783 12.2975 10.0783 12.0831 10.1916C11.8687 10.3049 11.7138 10.4499 11.6275 10.6572C11.5412 10.8645 11.5163 11.1138 11.5535 11.3508C11.5907 11.5878 11.7045 11.8148 11.8831 11.9934C12.0617 12.172 12.3125 12.2658 12.6222 12.2658C13.6987 12.2658 14.5254 11.3391 14.5254 9.99996C14.5254 8.65082 13.6987 7.7241 12.6222 7.7241C11.6457 7.7241 10.719 8.65082 10.719 9.99996C10.719 11.3491 11.6457 12.2758 12.6222 12.2758C13.6987 12.2758 14.5254 11.3491 14.5254 9.99996Z"
                    fill=""
                  />
                </svg>
                Account Settings
              </Link>
            </li>
          </ul>
          <div className="p-2.5">
           
            <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base">
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1815_13085)">
                  <path
                    d="M11.209 0.9375C10.1833 0.937485 9.35657 0.937473 8.70635 1.02489C8.03127 1.11566 7.46286 1.30983 7.01142 1.76126C6.61773 2.15496 6.4188 2.63877 6.31437 3.20727C6.2129 3.75969 6.19349 4.43572 6.18897 5.24687C6.18724 5.55753 6.43768 5.81076 6.74833 5.81249C7.05899 5.81422 7.31223 5.56379 7.31396 5.25313C7.31852 4.43301 7.33982 3.8517 7.42086 3.41051C7.49895 2.9854 7.62433 2.73935 7.80692 2.55676C8.01449 2.34919 8.30592 2.21385 8.85625 2.13986C9.42276 2.0637 10.1736 2.0625 11.2502 2.0625H12.0002C13.0767 2.0625 13.8276 2.0637 14.3941 2.13986C14.9444 2.21385 15.2358 2.34919 15.4434 2.55676C15.651 2.76433 15.7863 3.05576 15.8603 3.60609C15.9365 4.1726 15.9377 4.92344 15.9377 6V12C15.9377 13.0766 15.9365 13.8274 15.8603 14.3939C15.7863 14.9442 15.651 15.2357 15.4434 15.4432C15.2358 15.6508 14.9444 15.7862 14.3941 15.8601C13.8276 15.9363 13.0767 15.9375 12.0002 15.9375H11.2502C10.1736 15.9375 9.42276 15.9363 8.85625 15.8601C8.30592 15.7862 8.01449 15.6508 7.80692 15.4432C7.62433 15.2607 7.49895 15.0146 7.42086 14.5895C7.33982 14.1483 7.31852 13.567 7.31396 12.7469C7.31223 12.4362 7.05899 12.1858 6.74833 12.1875C6.43768 12.1892 6.18724 12.4425 6.18897 12.7531C6.19349 13.5643 6.2129 14.2403 6.31437 14.7927C6.4188 15.3612 6.61773 15.845 7.01142 16.2387C7.46286 16.6902 8.03127 16.8843 8.70635 16.9751C9.35657 17.0625 10.1833 17.0625 11.209 17.0625H12.0413C13.067 17.0625 13.8937 17.0625 14.544 16.9751C15.2191 16.8843 15.7875 16.6902 16.2389 16.2387C16.6903 15.7873 16.8845 15.2189 16.9753 14.5438C17.0627 13.8936 17.0627 13.0668 17.0627 12.0412V5.95885C17.0627 4.93316 17.0627 4.10641 16.9753 3.45619C16.8845 2.78111 16.6903 2.2127 16.2389 1.76126C15.7875 1.30983 15.2191 1.11566 14.544 1.02489C13.8938 0.937473 13.067 0.937485 12.0413 0.9375H11.209Z"
                    fill=""
                  />
                  <path
                    d="M11.25 8.4375C11.5607 8.4375 11.8125 8.68934 11.8125 9C11.8125 9.31066 11.5607 9.5625 11.25 9.5625H3.02058L4.49107 10.8229C4.72694 11.0251 4.75426 11.3802 4.55208 11.6161C4.34991 11.8519 3.9948 11.8793 3.75893 11.6771L1.13393 9.42708C1.00925 9.32022 0.9375 9.16421 0.9375 9C0.9375 8.83579 1.00925 8.67978 1.13393 8.57292L3.75893 6.32292C3.9948 6.12074 4.34991 6.14806 4.55208 6.38393C4.75426 6.6198 4.72694 6.97491 4.49107 7.17708L3.02058 8.4375H11.25Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1815_13085">
                    <rect width="18" height="18" rx="5" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Logout
            </button>

          </div>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;