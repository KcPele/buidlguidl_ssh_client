import React from "react";
import Link from "next/link";
import { FaApple } from "react-icons/fa";

const MacCard = () => {
  return (
    <Link href="/dashboard/setup/mac" className="transition-transform hover:scale-105">
      <div className="card bg-base-200 hover:bg-secondary hover:bg-opacity-10 cursor-pointer opacity-80">
        <div className="card-body p-4 items-center text-center">
          <FaApple className="w-12 h-12 md:w-14 md:h-14 mb-3 text-secondary" />
          <h3 className="card-title text-lg mb-2">Mac Setup</h3>
          <p className="text-xs md:text-sm mb-3">Streamlined node setup process for Mac environments.</p>
          <div className="badge badge-secondary">Coming Soon</div>
        </div>
      </div>
    </Link>
  );
};

export default MacCard;
