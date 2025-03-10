"use client";

import React from "react";
import { 
  ChevronRight, 
  Mail, 
  Download, 
  Plus, 
  Trash, 
  Check, 
  X, 
  RefreshCw 
} from "lucide-react";

interface ButtonExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  code: string;
}

const ButtonExample: React.FC<ButtonExampleProps> = ({
  title,
  description,
  children,
  className,
  code,
}) => {
  return (
    <div className={`mb-8 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {children}
      </div>
      <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md overflow-x-auto">
        <pre className="text-xs font-mono text-neutral-800 dark:text-neutral-200">{code}</pre>
      </div>
    </div>
  );
};

export const Buttons: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Edunéxia Button System</h2>
      
      <ButtonExample
        title="Primary Buttons"
        description="Used for primary actions and main call-to-actions"
        code={`<button className="btn-primary">Primary Button</button>
<button className="btn-primary">
  <Mail className="mr-2 h-4 w-4" /> With Icon
</button>
<button className="btn-primary" disabled>Disabled</button>`}
      >
        <button className="btn-primary">Primary Button</button>
        <button className="btn-primary">
          <Mail className="mr-2 h-4 w-4" /> With Icon
        </button>
        <button className="btn-primary" disabled>Disabled</button>
      </ButtonExample>
      
      <ButtonExample
        title="Secondary Buttons"
        description="Used for secondary actions that still need emphasis"
        code={`<button className="btn-secondary">Secondary Button</button>
<button className="btn-secondary">
  <Download className="mr-2 h-4 w-4" /> With Icon
</button>
<button className="btn-secondary" disabled>Disabled</button>`}
      >
        <button className="btn-secondary">Secondary Button</button>
        <button className="btn-secondary">
          <Download className="mr-2 h-4 w-4" /> With Icon
        </button>
        <button className="btn-secondary" disabled>Disabled</button>
      </ButtonExample>
      
      <ButtonExample
        title="Outline Buttons"
        description="Used for less prominent actions or in combination with primary buttons"
        code={`<button className="btn-outline">Outline Button</button>
<button className="btn-outline">
  <Plus className="mr-2 h-4 w-4" /> With Icon
</button>
<button className="btn-outline" disabled>Disabled</button>`}
      >
        <button className="btn-outline">Outline Button</button>
        <button className="btn-outline">
          <Plus className="mr-2 h-4 w-4" /> With Icon
        </button>
        <button className="btn-outline" disabled>Disabled</button>
      </ButtonExample>
      
      <ButtonExample
        title="Ghost Buttons"
        description="Used for the least prominent actions or in toolbars"
        code={`<button className="btn-ghost">Ghost Button</button>
<button className="btn-ghost">
  <Trash className="mr-2 h-4 w-4" /> With Icon
</button>
<button className="btn-ghost" disabled>Disabled</button>`}
      >
        <button className="btn-ghost">Ghost Button</button>
        <button className="btn-ghost">
          <Trash className="mr-2 h-4 w-4" /> With Icon
        </button>
        <button className="btn-ghost" disabled>Disabled</button>
      </ButtonExample>
      
      <ButtonExample
        title="Gradient Buttons"
        description="Used for high-emphasis actions and main call-to-actions"
        code={`<button className="btn-gradient">Gradient Button</button>
<button className="btn-gradient">
  <ChevronRight className="mr-2 h-4 w-4" /> With Icon
</button>
<button className="btn-gradient" disabled>Disabled</button>`}
      >
        <button className="btn-gradient">Gradient Button</button>
        <button className="btn-gradient">
          <ChevronRight className="mr-2 h-4 w-4" /> With Icon
        </button>
        <button className="btn-gradient" disabled>Disabled</button>
      </ButtonExample>
      
      <ButtonExample
        title="Button Sizes"
        description="Different button sizes for various contexts"
        code={`<button className="btn-primary h-8 px-3 text-xs">Small</button>
<button className="btn-primary">Default</button>
<button className="btn-primary h-12 px-6 text-base">Large</button>
<button className="btn-primary h-14 px-8 text-lg">Extra Large</button>`}
      >
        <button className="btn-primary h-8 px-3 text-xs">Small</button>
        <button className="btn-primary">Default</button>
        <button className="btn-primary h-12 px-6 text-base">Large</button>
        <button className="btn-primary h-14 px-8 text-lg">Extra Large</button>
      </ButtonExample>
      
      <ButtonExample
        title="Icon Buttons"
        description="Buttons with only icons for compact UIs"
        code={`<button className="btn-primary w-10 p-0">
  <Plus className="h-4 w-4" />
</button>
<button className="btn-secondary w-10 p-0">
  <Check className="h-4 w-4" />
</button>
<button className="btn-outline w-10 p-0">
  <X className="h-4 w-4" />
</button>
<button className="btn-ghost w-10 p-0">
  <RefreshCw className="h-4 w-4" />
</button>`}
      >
        <button className="btn-primary w-10 p-0">
          <Plus className="h-4 w-4" />
        </button>
        <button className="btn-secondary w-10 p-0">
          <Check className="h-4 w-4" />
        </button>
        <button className="btn-outline w-10 p-0">
          <X className="h-4 w-4" />
        </button>
        <button className="btn-ghost w-10 p-0">
          <RefreshCw className="h-4 w-4" />
        </button>
      </ButtonExample>
      
      <ButtonExample
        title="Button Groups"
        description="Groups of related buttons"
        code={`<div className="inline-flex rounded-md shadow-sm">
  <button className="btn-outline rounded-r-none border-r-0">Previous</button>
  <button className="btn-outline rounded-none border-r-0">Current</button>
  <button className="btn-outline rounded-l-none">Next</button>
</div>`}
      >
        <div className="inline-flex rounded-md shadow-sm">
          <button className="btn-outline rounded-r-none border-r-0">Previous</button>
          <button className="btn-outline rounded-none border-r-0">Current</button>
          <button className="btn-outline rounded-l-none">Next</button>
        </div>
      </ButtonExample>
      
      <ButtonExample
        title="Semantic Buttons"
        description="Buttons with semantic meanings"
        code={`<button className="bg-green-500 hover:bg-green-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
  <Check className="mr-2 h-4 w-4" /> Success
</button>
<button className="bg-red-500 hover:bg-red-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
  <X className="mr-2 h-4 w-4" /> Danger
</button>
<button className="bg-yellow-500 hover:bg-yellow-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
  Warning
</button>
<button className="bg-blue-500 hover:bg-blue-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
  Info
</button>`}
      >
        <button className="bg-green-500 hover:bg-green-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
          <Check className="mr-2 h-4 w-4" /> Success
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
          <X className="mr-2 h-4 w-4" /> Danger
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
          Warning
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none">
          Info
        </button>
      </ButtonExample>
    </div>
  );
};

export default Buttons;
