"use client";

import React from "react";

interface CardExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  code: string;
}

const CardExample: React.FC<CardExampleProps> = ({
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

export const Cards: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Edunéxia Card System</h2>
      
      <CardExample
        title="Basic Cards"
        description="Standard cards for displaying content"
        code={`<div className="card p-4">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-sm text-neutral-500">Card description goes here.</p>
</div>`}
      >
        <div className="card p-4 w-64">
          <h3 className="text-lg font-semibold">Card Title</h3>
          <p className="text-sm text-neutral-500">Card description goes here.</p>
        </div>
      </CardExample>
      
      <CardExample
        title="Gradient Cards"
        description="Cards with gradient backgrounds for visual emphasis"
        code={`<div className="card-gradient p-4">
  <h3 className="text-lg font-semibold">Gradient Card</h3>
  <p className="text-sm text-neutral-500">Card with gradient background.</p>
</div>`}
      >
        <div className="card-gradient p-4 w-64">
          <h3 className="text-lg font-semibold">Gradient Card</h3>
          <p className="text-sm text-neutral-500">Card with gradient background.</p>
        </div>
      </CardExample>
      
      <CardExample
        title="Interactive Cards"
        description="Cards with hover and focus states"
        code={`<div className="card p-4 card-hover cursor-pointer">
  <h3 className="text-lg font-semibold">Interactive Card</h3>
  <p className="text-sm text-neutral-500">Hover over this card to see the effect.</p>
</div>`}
      >
        <div className="card p-4 card-hover cursor-pointer w-64">
          <h3 className="text-lg font-semibold">Interactive Card</h3>
          <p className="text-sm text-neutral-500">Hover over this card to see the effect.</p>
        </div>
      </CardExample>
      
      <CardExample
        title="Card with Header"
        description="Cards with distinct header sections"
        code={`<div className="card w-64">
  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded-t-lg">
    <h3 className="text-lg font-semibold">Card Header</h3>
  </div>
  <div className="p-4">
    <p className="text-sm text-neutral-500">Card content goes here.</p>
  </div>
</div>`}
      >
        <div className="card w-64">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded-t-lg">
            <h3 className="text-lg font-semibold">Card Header</h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-neutral-500">Card content goes here.</p>
          </div>
        </div>
      </CardExample>
      
      <CardExample
        title="Card with Footer"
        description="Cards with distinct footer sections"
        code={`<div className="card w-64">
  <div className="p-4">
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="text-sm text-neutral-500">Card content goes here.</p>
  </div>
  <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded-b-lg">
    <button className="btn-primary text-xs h-8 px-3">Action</button>
  </div>
</div>`}
      >
        <div className="card w-64">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Card Title</h3>
            <p className="text-sm text-neutral-500">Card content goes here.</p>
          </div>
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 rounded-b-lg">
            <button className="btn-primary text-xs h-8 px-3">Action</button>
          </div>
        </div>
      </CardExample>
      
      <CardExample
        title="Primary Card"
        description="Cards with primary color accents"
        code={`<div className="card p-4 border-l-4 border-l-primary-500">
  <h3 className="text-lg font-semibold">Primary Card</h3>
  <p className="text-sm text-neutral-500">Card with primary color accent.</p>
</div>`}
      >
        <div className="card p-4 border-l-4 border-l-primary-500 w-64">
          <h3 className="text-lg font-semibold">Primary Card</h3>
          <p className="text-sm text-neutral-500">Card with primary color accent.</p>
        </div>
      </CardExample>
      
      <CardExample
        title="Card with Badge"
        description="Cards with status badges"
        code={`<div className="card p-4 w-64">
  <div className="flex justify-between items-start mb-2">
    <h3 className="text-lg font-semibold">Card with Badge</h3>
    <span className="badge-primary">New</span>
  </div>
  <p className="text-sm text-neutral-500">Card with status badge.</p>
</div>`}
      >
        <div className="card p-4 w-64">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">Card with Badge</h3>
            <span className="badge-primary">New</span>
          </div>
          <p className="text-sm text-neutral-500">Card with status badge.</p>
        </div>
      </CardExample>
      
      <CardExample
        title="Card with Gradient Border"
        description="Cards with gradient borders for visual emphasis"
        code={`<div className="p-[1px] rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500">
  <div className="bg-card rounded-[7px] p-4">
    <h3 className="text-lg font-semibold">Gradient Border</h3>
    <p className="text-sm text-neutral-500">Card with gradient border.</p>
  </div>
</div>`}
      >
        <div className="p-[1px] rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 w-64">
          <div className="bg-card rounded-[7px] p-4">
            <h3 className="text-lg font-semibold">Gradient Border</h3>
            <p className="text-sm text-neutral-500">Card with gradient border.</p>
          </div>
        </div>
      </CardExample>
    </div>
  );
};

export default Cards;
