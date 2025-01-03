"use client";

import React, { useState } from "react";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";

const Ubuntu = () => {
  const [activeSection, setActiveSection] = useState("node-monitor");

  return (
    <main className="flex h-[calc(100vh-4rem)] bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <MainContent activeSection={activeSection} />
    </main>
  );
};

export default Ubuntu;
