"use client";
import React from "react";
import { MapProvider } from "@/provider/maps";
import PakistanMap from "./Pakistan";

const MapOne: React.FC = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div className="w-full"> {/* Removed fixed height to allow map to control size */}
        <MapProvider>
          <PakistanMap />
        </MapProvider>
      </div>
    </div>
  );
};

export default MapOne;