import MacCard from "~~/components/ssh/mac/MacCard";
import UbuntuCard from "~~/components/ssh/ubuntu/UbuntuCard";
import WindowsCard from "~~/components/ssh/windows/WindowsCard";

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
              <UbuntuCard />

              {/* Windows Card */}
              <WindowsCard />

              {/* Mac Card */}
              <MacCard />
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
