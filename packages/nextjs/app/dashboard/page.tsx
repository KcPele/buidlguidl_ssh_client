"use client";

import Link from "next/link";
import { FaApple, FaUbuntu, FaWindows } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className=" p-4">
      <div className="max-w-6xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-2xl md:text-3xl mb-4">Welcome to Node Setup</h2>
            <p className="text-sm md:text-base mb-6">Choose your platform below to get started with your node setup.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ubuntu Card */}
              <Link href="/dashboard/setup/ubuntu" className="transition-transform hover:scale-105">
                <div className="card bg-base-200 hover:bg-primary hover:bg-opacity-10 cursor-pointer">
                  <div className="card-body p-4 items-center text-center">
                    <FaUbuntu className="w-12 h-12 md:w-14 md:h-14 mb-3 text-primary" />
                    <h3 className="card-title text-lg mb-2">Ubuntu Setup</h3>
                    <p className="text-xs md:text-sm mb-3">
                      Complete node setup for Ubuntu with automated installation.
                    </p>
                    <div className="badge badge-success">Available Now</div>
                  </div>
                </div>
              </Link>

              {/* Windows Card */}
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

              {/* Mac Card */}
              <Link href="/dashboard/setup/mac" className="transition-transform hover:scale-105">
                <div className="card bg-base-200 hover:bg-secondary hover:bg-opacity-10 cursor-pointer opacity-80">
                  <div className="card-body p-4 items-center text-center">
                    <FaApple className="w-12 h-12 md:w-14 md:h-14 mb-3 text-secondary" />
                    <h3 className="card-title text-lg mb-2">MacOS Setup</h3>
                    <p className="text-xs md:text-sm mb-3">Native node setup experience for MacOS users.</p>
                    <div className="badge badge-secondary">Coming Soon</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-6 p-3 bg-base-200 rounded-lg text-sm">
              <h3 className="font-semibold mb-2">Why Choose Our Node Setup?</h3>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                <li>Automated installation process saves time</li>
                <li>Step-by-step progress tracking</li>
                <li>Pre-configured settings for performance</li>
                <li>Comprehensive error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
