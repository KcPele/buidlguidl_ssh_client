import React from "react";
import Link from "next/link";
import { FaWindows } from "react-icons/fa";

const WindowsCard = () => {
  return (
    <Link href="/dashboard/setup/windows" className="transition-transform hover:scale-105">
      <div className="card bg-base-200 hover:bg-info hover:bg-opacity-10 cursor-pointer opacity-80">
        <div className="card-body p-4 items-center text-center">
          <FaWindows className="w-12 h-12 md:w-14 md:h-14 mb-3 text-info" />
          <h3 className="card-title text-lg mb-2">Windows Setup</h3>
          <p className="text-xs md:text-sm mb-3">Streamlined node setup process for Windows environments.</p>
          <div className="badge badge-info">Coming Soon</div>
        </div>
      </div>
    </Link>
  );
};

export default WindowsCard;
