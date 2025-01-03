"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen  p-4">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full max-w-lg mx-auto mb-8"
          >
            {/* Insert the SVG illustration here */}
          </motion.div>

          {/* Text Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Oops! Lost in Space
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              The page you're looking for has drifted into deep space. Let's get you back to familiar territory.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/" className="btn btn-primary gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
              <button onClick={() => window.history.back()} className="btn btn-ghost gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </motion.div>
        </div>

        {/* Shooting Stars Animation */}
        {mounted && (
          <motion.div>
            <motion.div
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary rounded-full"
              animate={{
                x: [0, 100],
                y: [0, 100],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary rounded-full"
              animate={{
                x: [-100, 0],
                y: [0, 100],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 4,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
