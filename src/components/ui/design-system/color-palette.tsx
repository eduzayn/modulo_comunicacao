"use client";

import React from "react";
import { colors } from "../../../styles/colors";

interface ColorSwatchProps {
  color: string;
  name: string;
  value: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name, value }) => {
  return (
    <div className="flex flex-col">
      <div 
        className="w-20 h-20 rounded-md mb-2" 
        style={{ backgroundColor: color }}
      />
      <div className="text-sm font-medium">{name}</div>
      <div className="text-xs text-neutral-500">{value}</div>
    </div>
  );
};

interface ColorGroupProps {
  title: string;
  colors: Record<string, string>;
  prefix?: string;
}

const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors, prefix = "" }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <ColorSwatch 
            key={key} 
            color={value} 
            name={`${prefix}${key}`} 
            value={value} 
          />
        ))}
      </div>
    </div>
  );
};

interface GradientSwatchProps {
  gradient: string;
  name: string;
}

const GradientSwatch: React.FC<GradientSwatchProps> = ({ gradient, name }) => {
  return (
    <div className="flex flex-col">
      <div 
        className="w-full h-20 rounded-md mb-2" 
        style={{ background: gradient }}
      />
      <div className="text-sm font-medium">{name}</div>
    </div>
  );
};

export const ColorPalette: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Edunéxia Color Palette</h2>
      
      <ColorGroup 
        title="Primary Colors" 
        colors={colors.primary} 
        prefix="primary-"
      />
      
      <ColorGroup 
        title="Secondary Colors" 
        colors={colors.secondary} 
        prefix="secondary-"
      />
      
      <ColorGroup 
        title="Neutral Colors" 
        colors={colors.neutral} 
        prefix="neutral-"
      />
      
      <ColorGroup 
        title="Accent Colors" 
        colors={colors.accent} 
        prefix="accent-"
      />
      
      <ColorGroup 
        title="Semantic Colors" 
        colors={colors.semantic} 
        prefix="semantic-"
      />
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Gradients</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <GradientSwatch 
            gradient={colors.gradients.primary} 
            name="Primary Gradient" 
          />
          <GradientSwatch 
            gradient={colors.gradients.dark} 
            name="Dark Gradient" 
          />
          <GradientSwatch 
            gradient={colors.gradients.card} 
            name="Card Gradient" 
          />
          <GradientSwatch 
            gradient={colors.gradients.accent} 
            name="Accent Gradient" 
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Base Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorSwatch 
            color={colors.white} 
            name="White" 
            value={colors.white} 
          />
          <ColorSwatch 
            color={colors.black} 
            name="Black" 
            value={colors.black} 
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
