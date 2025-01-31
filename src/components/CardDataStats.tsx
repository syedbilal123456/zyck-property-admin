import React, { ReactNode, useEffect, useState } from "react";
import Model from "./Model";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
  view?: boolean;
  userDetails: [];
}

interface CardUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  name: string;
  city: string;
  state: string;
  properties: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  view,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {

   // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev); // Toggle modal open/close


  // Redux State for Date
  const date = useSelector((state: RootState) => state.date);

  const [data, setData] = useState<{ usersDetails: CardUser[] }>({
        usersDetails: [],
      });

  // User Data State
  // const [usersDetails, setUsersDetails] = useState<User[]>([]);

  // Fetch Users Only When Date Changes
  useEffect(() => {
    if (!date?.startDate || !date?.endDate) return; // Ensure date is available

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/listing?startDate=${date.startDate}&endDate=${date.endDate}`);
        if (!response.ok) {
          throw new Error("Error Response");
        }
        const result = await response.json();
        console.log("Fetched Data:", result);

        // Ensure the API response contains `usersDetails`
        const usersDetails: CardUser[] = result?.usersDetails.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          name: user.firstName || '',
          city: user.city || '',
          state: user.state || '',
          properties: user.properties || []
        })) || [];
        setData({ usersDetails });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [date]);

  // const { usersDetails } = data;

  // console.log("usersDetails *********>", usersDetails);
  console.log("data", data);

  if (!data) return <div>Loading...</div>;
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className={`flex h-12.5 w-full items-center justify-between ${view &&  " !w-full " }   `}>
       <div className=" items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"> {children}</div>
        {view && 
          <span className="text-sm font-medium">
            {/* View Users Button */}
        <button
          onClick={toggleModal}
          className="text-green-500 hover:underline p-2 rounded-md"
          >
          View Users
        </button>
        {/* Modal Component */}
        <Model
          isOpen={isModalOpen}
          onClose={toggleModal} // Close modal on clicking close button
          usersDetails={data?.usersDetails || []}
          />
          </span>}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}</span>
         
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp && "text-meta-3"
          } ${levelDown && "text-meta-5"} `}
        >
          {rate}

          {levelUp && (
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          )}
          {levelDown && (
            <svg
              className="fill-meta-5"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                fill=""
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
