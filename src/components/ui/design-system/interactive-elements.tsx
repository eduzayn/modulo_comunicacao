"use client";

import React, { useState } from "react";

interface InteractiveExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  code: string;
}

const InteractiveExample: React.FC<InteractiveExampleProps> = ({
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
      <div className="mb-4">
        {children}
      </div>
      <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-md overflow-x-auto">
        <pre className="text-xs font-mono text-neutral-800 dark:text-neutral-200">{code}</pre>
      </div>
    </div>
  );
};

export const InteractiveElements: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [isChecked, setIsChecked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Interactive Elements</h2>
      
      <InteractiveExample
        title="Dropdown Menus"
        description="Interactive dropdown menus with hover and focus states"
        code={`<div className="relative">
  <button 
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className="btn-primary flex items-center"
  >
    Dropdown Menu
    <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
  
  {dropdownOpen && (
    <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1">
        <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700">Option 1</a>
        <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700">Option 2</a>
        <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700">Option 3</a>
      </div>
    </div>
  )}
</div>`}
      >
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn-primary flex items-center"
          >
            Dropdown Menu
            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700">Option 1</a>
                <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700">Option 2</a>
                <a href="#" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700">Option 3</a>
              </div>
            </div>
          )}
        </div>
      </InteractiveExample>
      
      <InteractiveExample
        title="Modal Dialogs"
        description="Interactive modal dialogs with overlay"
        code={`<div>
  <button 
    onClick={() => setIsOpen(true)}
    className="btn-primary"
  >
    Open Modal
  </button>
  
  {isOpen && (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsOpen(false)}></div>
        
        <div className="relative bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Modal Title</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-neutral-600 dark:text-neutral-400">This is a modal dialog with a backdrop overlay. Click outside or the X to close.</p>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setIsOpen(false)}
              className="btn-outline mr-2"
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="btn-primary"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>`}
      >
        <div>
          <button 
            onClick={() => setIsOpen(true)}
            className="btn-primary"
          >
            Open Modal
          </button>
          
          {isOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsOpen(false)}></div>
                
                <div className="relative bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Modal Title</h3>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-neutral-600 dark:text-neutral-400">This is a modal dialog with a backdrop overlay. Click outside or the X to close.</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="btn-outline mr-2"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="btn-primary"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </InteractiveExample>
      
      <InteractiveExample
        title="Tabs"
        description="Interactive tabs for content organization"
        code={`<div>
  <div className="border-b border-neutral-200 dark:border-neutral-700">
    <nav className="flex -mb-px">
      {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => (
        <button
          key={index}
          onClick={() => setSelectedTab(index)}
          className={\`py-2 px-4 text-sm font-medium \${
            selectedTab === index
              ? 'border-b-2 border-primary-500 text-primary-500'
              : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300'
          }\`}
        >
          {tab}
        </button>
      ))}
    </nav>
  </div>
  
  <div className="py-4">
    {selectedTab === 0 && <p>Content for Tab 1</p>}
    {selectedTab === 1 && <p>Content for Tab 2</p>}
    {selectedTab === 2 && <p>Content for Tab 3</p>}
  </div>
</div>`}
      >
        <div>
          <div className="border-b border-neutral-200 dark:border-neutral-700">
            <nav className="flex -mb-px">
              {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTab(index)}
                  className={`py-2 px-4 text-sm font-medium ${
                    selectedTab === index
                      ? 'border-b-2 border-primary-500 text-primary-500'
                      : 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="py-4">
            {selectedTab === 0 && <p>Content for Tab 1</p>}
            {selectedTab === 1 && <p>Content for Tab 2</p>}
            {selectedTab === 2 && <p>Content for Tab 3</p>}
          </div>
        </div>
      </InteractiveExample>
      
      <InteractiveExample
        title="Sliders"
        description="Interactive sliders with visual feedback"
        code={`<div>
  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
    Slider Value: {sliderValue}
  </label>
  <div className="relative">
    <input
      type="range"
      min="0"
      max="100"
      value={sliderValue}
      onChange={(e) => setSliderValue(parseInt(e.target.value))}
      className="w-full h-2 bg-neutral-200 rounded-md appearance-none cursor-pointer dark:bg-neutral-700"
    />
    <div 
      className="absolute h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-md" 
      style={{ width: \`\${sliderValue}%\` }}
    ></div>
  </div>
</div>`}
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Slider Value: {sliderValue}
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-md appearance-none cursor-pointer dark:bg-neutral-700"
            />
            <div 
              className="absolute h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-md" 
              style={{ width: `${sliderValue}%` }}
            ></div>
          </div>
        </div>
      </InteractiveExample>
      
      <InteractiveExample
        title="Toggle Switches"
        description="Interactive toggle switches with visual feedback"
        code={`<div className="flex items-center">
  <button
    onClick={() => setIsChecked(!isChecked)}
    className={\`relative inline-flex h-6 w-11 items-center rounded-full \${
      isChecked ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-700'
    }\`}
  >
    <span
      className={\`inline-block h-4 w-4 transform rounded-full bg-white transition \${
        isChecked ? 'translate-x-6' : 'translate-x-1'
      }\`}
    />
  </button>
  <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
    {isChecked ? 'Enabled' : 'Disabled'}
  </span>
</div>`}
      >
        <div className="flex items-center">
          <button
            onClick={() => setIsChecked(!isChecked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              isChecked ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isChecked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {isChecked ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </InteractiveExample>
      
      <InteractiveExample
        title="Tooltips"
        description="Informative tooltips that appear on hover"
        code={`<div className="relative inline-block">
  <button className="btn-primary">
    Hover Me
  </button>
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
    This is a tooltip
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
  </div>
</div>`}
      >
        <div className="relative inline-block group">
          <button className="btn-primary">
            Hover Me
          </button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            This is a tooltip
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
          </div>
        </div>
      </InteractiveExample>
    </div>
  );
};

export default InteractiveElements;
