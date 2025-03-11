"use client";

import React, { useState } from "react";
import ColorPalette from "./color-palette";
import Typography from "./typography";
import Buttons from "./buttons";
import Cards from "./card";
import Navigation from "./navigation";
import Forms from "./forms";

interface TabProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ title, isActive, onClick }) => {
  return (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
        isActive
          ? "bg-primary-500 text-white"
          : "text-neutral-600 hover:text-primary-500 dark:text-neutral-300"
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export const DesignSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "buttons" | "cards" | "navigation" | "forms">("colors");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Edunéxia Design System</h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A comprehensive design system for the Edunéxia Communication Module,
            featuring a blue, black, and white color palette with modern gradients.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex flex-wrap gap-2">
              <Tab
                title="Color Palette"
                isActive={activeTab === "colors"}
                onClick={() => setActiveTab("colors")}
              />
              <Tab
                title="Typography"
                isActive={activeTab === "typography"}
                onClick={() => setActiveTab("typography")}
              />
              <Tab
                title="Buttons"
                isActive={activeTab === "buttons"}
                onClick={() => setActiveTab("buttons")}
              />
              <Tab
                title="Cards"
                isActive={activeTab === "cards"}
                onClick={() => setActiveTab("cards")}
              />
              <Tab
                title="Navigation"
                isActive={activeTab === "navigation"}
                onClick={() => setActiveTab("navigation")}
              />
              <Tab
                title="Forms"
                isActive={activeTab === "forms"}
                onClick={() => setActiveTab("forms")}
              />
            </div>
          </div>

          <div className="p-4">
            {activeTab === "colors" && <ColorPalette />}
            {activeTab === "typography" && <Typography />}
            {activeTab === "buttons" && <Buttons />}
            {activeTab === "cards" && <Cards />}
            {activeTab === "navigation" && <Navigation />}
            {activeTab === "forms" && <Forms />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem;
