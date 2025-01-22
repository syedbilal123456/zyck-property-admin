"use client";

import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useState } from "react";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Handle Date Change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target; // `id` will be "startDate" or "endDate"
    setDateRange((prev) => ({
      ...prev,
      [id]: value, // Dynamically update the corresponding date
    }));
  };

  console.log(dateRange)

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white shadow-md dark:bg-boxdark overflow-hidden">
      <div className="flex w-full items-center justify-between px-4 py-3 md:px-6 2xl:px-11 relative">
        {/* Sidebar Toggle and Logo */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="block relative rounded border border-stroke bg-white p-2 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="block relative h-5.5 w-5.5">
              {/* Hamburger Icon */}
              <span className="absolute block w-[100%] h-0.5 bg-black dark:bg-white"></span>
              <span className="absolute block w-[100%] h-0.5 bg-black dark:bg-white top-2"></span>
              <span className="absolute block w-[100%] h-0.5 bg-black dark:bg-white top-4"></span>
            </span>
          </button>

          {/* Logo */}
          <Link href="/" className="hidden">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Date Inputs, Button, and Search Bar */}
        <div className="flex w-full items-center justify-between gap-4 ml-2">
          {/* Form Container */}
          <form className="flex flex-grow items-center gap-4">
            {/* Start Date Input */}
            <div className="flex items-center">
              {/* Icon for Mobile */}
              <div className="relative block lg:hidden">
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="absolute top-0 left-0 h-full w-full opacity-0"
                />
                <button
                  type="button"
                  className="p-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10m-2 9h-6a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Full Input for Larger Screens */}
              <div className="hidden lg:flex flex-col">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 lg:mr-2"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-boxdark dark:text-white"
                />
              </div>
            </div>

            {/* End Date Input */}
            <div className="flex items-center">
              {/* Icon for Mobile */}
              <div className="relative block lg:hidden">
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="absolute top-0 left-0 h-full w-full opacity-0"
                />
                <button
                  type="button"
                  className="p-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10m-2 9h-6a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Full Input for Larger Screens */}
              <div className="hidden lg:flex flex-col">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 lg:mr-2"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="rounded border border-gray-300 p-2 dark:border-gray-700 dark:bg-boxdark dark:text-white"
                />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-64 hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded border border-gray-300 p-2 pl-10 text-gray-700 dark:border-gray-700 dark:bg-boxdark dark:text-white"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 18l6 6m0-6l-6-6m9-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* User and Dark Mode Switcher */}
        <div className="flex items-center gap-3 2xsm:gap-7 mr-4">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />
          </ul>
          {/* User Dropdown */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
