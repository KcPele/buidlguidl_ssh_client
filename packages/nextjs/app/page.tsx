"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, MonitorUp, Shield, Terminal } from "lucide-react";

interface Step {
  id: string;
  title: string;
  commands: string[];
  status: "pending" | "in-progress" | "completed";
  output: string;
  isCompleted: boolean;
}
// Updated Landing Page
export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "system-update",
      title: "System Update",
      commands: ["sudo apt update", "sudo apt upgrade -y", "sudo apt install curl -y"],
      status: "completed",
      output: "",
      isCompleted: true,
    },
    {
      id: "node-install",
      title: "Node.js Installation",
      commands: [
        "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash",
        "source ~/.bashrc",
        "nvm install --lts",
      ],
      status: "completed",
      output: "",
      isCompleted: true,
    },
    {
      id: "git-yarn",
      title: "Git and Yarn Installation",
      commands: ["sudo apt install git -y", "npm install --global yarn"],
      status: "completed",
      output: "",
      isCompleted: true,
    },
    {
      id: "pm2-install",
      title: "PM2 Installation",
      commands: ["yarn global add pm2"],
      status: "completed",
      output: "",
      isCompleted: true,
    },
    {
      id: "clone-repo",
      title: "Clone GitHub Repository",
      commands: [
        "git clone https://github.com/BuidlGuidl/buidlguidl-client.git",
        "cd buidlguidl-client",
        "yarn install",
      ],
      status: "completed",
      output: "",
      isCompleted: true,
    },
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="hero min-h-screen bg-base-200"
      >
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <motion.h1 variants={itemVariants} className="text-5xl font-bold text-base-content mb-8">
              Node Management Made <span className="text-primary">Effortless</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl mb-8 text-base-content/80">
              Experience seamless control over your nodes with advanced monitoring, analytics, and secure SSH access.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/connection" className="btn btn-primary btn-lg">
                Start Managing Now
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-base-100"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <motion.div whileHover={{ scale: 1.05 }} className="card bg-base-200 shadow-center">
              <div className="card-body items-center text-center">
                <Terminal className="w-12 h-12 text-primary mb-4" />
                <h2 className="card-title text-base-content">Integrated Terminal</h2>
                <p className="text-base-content/70">Access your nodes directly via a built-in terminal.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div whileHover={{ scale: 1.05 }} className="card bg-base-200 shadow-center">
              <div className="card-body items-center text-center">
                <MonitorUp className="w-12 h-12 text-primary mb-4" />
                <h2 className="card-title text-base-content">Performance Metrics</h2>
                <p className="text-base-content/70">Track CPU, memory usage, and node health at a glance.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div whileHover={{ scale: 1.05 }} className="card bg-base-200 shadow-center">
              <div className="card-body items-center text-center">
                <BarChart3 className="w-12 h-12 text-primary mb-4" />
                <h2 className="card-title text-base-content">Data Visualization</h2>
                <p className="text-base-content/70">Beautiful, actionable insights through smart analytics.</p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div whileHover={{ scale: 1.05 }} className="card bg-base-200 shadow-center">
              <div className="card-body items-center text-center">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h2 className="card-title text-base-content">SSH Security</h2>
                <p className="text-base-content/70">Secure, seamless access to your nodes with SSH.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="py-20 bg-base-200"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-base-content mb-4">Node Setup Preview</h2>
            <p className="text-xl text-base-content/70">
              Follow the streamlined steps to set up your node effortlessly.
            </p>
          </div>

          <div className="bg-base-300 p-6 rounded-lg shadow-lg">
            <ul className="space-y-4">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className={`p-4 rounded-md ${
                    step.isCompleted ? "bg-green-100 text-green-900" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{`${index + 1}. ${step.title}`}</h3>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        step.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : step.status === "in-progress"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {step.status === "completed"
                        ? "Completed"
                        : step.status === "in-progress"
                          ? "In Progress"
                          : "Pending"}
                    </span>
                  </div>
                  <ul className="mt-2 pl-4 list-disc">
                    {step.commands.map((command, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {command}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
      {/* Visual Showcase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="py-20 bg-base-200"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-base-content mb-4">What You'll See</h2>
            <p className="text-xl text-base-content/70">
              Streamlined views of terminal, logs, and performance metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Image
              src="/mnt/data/Screenshot from 2024-12-19 16-07-48.png"
              alt="Node Manager Terminal"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
            <Image
              src="/mnt/data/Screenshot from 2024-12-19 16-08-57.png"
              alt="CPU and Memory Usage Charts"
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-base-100"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-base-content mb-6">Ready to Optimize Your Node Management?</h2>
          <p className="text-xl text-base-content/70 mb-8">
            Experience a revolutionary way to manage your infrastructure.
          </p>
          <Link href="/connection" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
