"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  Clock,
  Command,
  Database,
  Globe,
  Lock,
  MonitorUp,
  PieChart,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  commands: string[];
  status: "pending" | "in-progress" | "completed";
  output: string;
  isCompleted: boolean;
}
const steps: Step[] = [
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
    commands: ["git clone https://github.com/BuidlGuidl/buidlguidl-client.git", "cd buidlguidl-client", "yarn install"],
    status: "completed",
    output: "",
    isCompleted: true,
  },
];
// Updated Landing Page
export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const statistics = [
    { value: "99.9%", label: "Uptime", icon: Activity },
    { value: "<500ms", label: "Latency", icon: Clock },
    { value: "24/7", label: "Monitoring", icon: MonitorUp },
    { value: "256-bit", label: "Encryption", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section - Enhanced */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="hero min-h-screen bg-gradient-to-b from-base-200 to-base-100 relative overflow-hidden"
      >
        <div className="hero-content text-center max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <motion.div variants={itemVariants} className="mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Next-Gen Node Management
              </span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-6xl font-bold text-base-content mb-8 leading-tight">
              Node Management Made <span className="text-primary">Intelligent</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl mb-8 text-base-content/80 max-w-2xl mx-auto">
              Experience the future of node management with advanced monitoring, real-time analytics, and secure SSH
              access. Your infrastructure deserves intelligent oversight.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4 justify-center">
              <Link href="/connection" className="btn btn-primary btn-lg">
                Start Managing Now
              </Link>
              <Link href="#features" className="btn btn-ghost btn-lg">
                Explore Features
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 opacity-20"
          >
            <Server className="w-24 h-24" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/3 right-1/4 opacity-20"
          >
            <Database className="w-20 h-20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-base-200"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }} className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <stat.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-4xl font-bold text-base-content">{stat.value}</h3>
                  <p className="text-base-content/70">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Grid - Enhanced */}
      <motion.section
        id="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        className="py-20 bg-base-100"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">Comprehensive Feature Set</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Everything you need to manage your nodes efficiently in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Terminal,
                title: "Advanced Terminal",
                description: "Built-in SSH terminal with syntax highlighting, command history, and auto-completion.",
              },
              {
                icon: PieChart,
                title: "Resource Analytics",
                description: "Real-time monitoring of CPU, memory, disk usage with historical data tracking.",
              },
              {
                icon: Shield,
                title: "Security First",
                description: "Enterprise-grade encryption, key management, and access controls.",
              },
              {
                icon: RefreshCw,
                title: "Auto Recovery",
                description: "Automated node recovery procedures and health checks.",
              },
              {
                icon: Globe,
                title: "Global Access",
                description: "Manage your nodes from anywhere with our secure web interface.",
              },
              {
                icon: Zap,
                title: "Performance Optimization",
                description: "Automated performance tuning and optimization recommendations.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="card bg-base-200 shadow-lg border border-base-300"
              >
                <div className="card-body">
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="card-title text-lg mb-2">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works - Process Flow */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: isVisible ? 1 : 0 }} className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">How It Works</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Simple, secure, and efficient node management in four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: Lock,
                title: "Connect",
                description: "Securely connect your wallet and authenticate",
              },
              {
                step: 2,
                icon: Settings,
                title: "Configure",
                description: "Set up your node preferences and requirements",
              },
              {
                step: 3,
                icon: Command,
                title: "Deploy",
                description: "Deploy your node with our automated setup",
              },
              {
                step: 4,
                icon: Activity,
                title: "Monitor",
                description: "Track performance and health in real-time",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="card bg-base-100 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full"></div>
                <div className="card-body">
                  <span className="text-4xl font-bold text-primary/20 absolute top-2 right-4">{step.step}</span>
                  <step.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="card-title text-lg mb-2">{step.title}</h3>
                  <p className="text-base-content/70">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Node Setup Preview - Enhanced */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: isVisible ? 1 : 0 }} className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">Automated Setup Process</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Our intelligent system handles the complex setup process automatically
            </p>
          </div>

          <div className="bg-base-200 rounded-lg shadow-xl p-8">
            <div className="flex gap-4 mb-8 overflow-x-auto">
              {["overview", "system", "nodejs", "deployment"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn btn-sm ${activeTab === tab ? "btn-primary" : "btn-ghost"}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card ${step.isCompleted ? "bg-success/10" : "bg-base-100"} shadow-lg`}
                >
                  <div className="card-body">
                    <div className="flex items-center gap-4">
                      <CheckCircle
                        className={`w-6 h-6 ${step.isCompleted ? "text-success" : "text-base-content/30"}`}
                      />
                      <div className="flex flex-1 gap-3 flex-col sm:flex-row sm:items-center">
                        <div className="flex-1">
                          <h3 className="font-bold">{step.title}</h3>
                          <div className="mt-2 space-y-1">
                            {step.commands.map((command, idx) => (
                              <code key={idx} className="block text-sm bg-base-300 p-2 rounded">
                                {command}
                              </code>
                            ))}
                          </div>
                        </div>
                        <span
                          className={`badge ${
                            step.status === "completed"
                              ? "badge-success"
                              : step.status === "in-progress"
                                ? "badge-primary"
                                : "badge-ghost"
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section - Enhanced */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
        className="py-20 bg-gradient-to-t from-base-200 to-base-100"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-base-content mb-6">Ready to Transform Your Node Management?</h2>
          <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Join other buidlguidl developers who trust our platform for their node management needs. Get started in
            minutes with our automated setup process.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/connection" className="btn btn-primary btn-lg">
              Start Now
            </Link>
            <Link href="/documentation" className="btn btn-ghost btn-lg">
              Read Documentation
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
