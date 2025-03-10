"use client";

import React from "react";

interface NavigationExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  code: string;
}

const NavigationExample: React.FC<NavigationExampleProps> = ({
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

export const Navigation: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Edunéxia Navigation System</h2>
      
      <NavigationExample
        title="Main Header"
        description="Primary navigation header with logo and main menu"
        code={`<header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center">
        <div className="text-primary-500 font-bold text-xl">Edunéxia</div>
      </div>
      <nav className="hidden md:flex space-x-8">
        <a href="#" className="nav-link-active">Dashboard</a>
        <a href="#" className="nav-link">Channels</a>
        <a href="#" className="nav-link">Conversations</a>
        <a href="#" className="nav-link">Templates</a>
        <a href="#" className="nav-link">AI Settings</a>
      </nav>
      <div className="flex items-center space-x-4">
        <button className="btn-ghost w-10 h-10 p-0 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <button className="btn-ghost w-10 h-10 p-0 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>`}
      >
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="text-primary-500 font-bold text-xl">Edunéxia</div>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="#" className="nav-link-active">Dashboard</a>
                  <a href="#" className="nav-link">Channels</a>
                  <a href="#" className="nav-link">Conversations</a>
                  <a href="#" className="nav-link">Templates</a>
                  <a href="#" className="nav-link">AI Settings</a>
                </nav>
                <div className="flex items-center space-x-4">
                  <button className="btn-ghost w-10 h-10 p-0 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button className="btn-ghost w-10 h-10 p-0 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>
      </NavigationExample>
      
      <NavigationExample
        title="Sidebar Navigation"
        description="Vertical sidebar navigation for desktop layouts"
        code={`<aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen">
  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
    <div className="text-primary-500 font-bold text-xl">Edunéxia</div>
  </div>
  <nav className="p-4 space-y-1">
    <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-primary-500 text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
      Dashboard
    </a>
    <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
      </svg>
      Channels
    </a>
    <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
      Conversations
    </a>
    <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
      Settings
    </a>
  </nav>
</aside>`}
      >
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden h-96">
          <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-full">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-primary-500 font-bold text-xl">Edunéxia</div>
            </div>
            <nav className="p-4 space-y-1">
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-primary-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Channels
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Conversations
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Settings
              </a>
            </nav>
          </aside>
        </div>
      </NavigationExample>
      
      <NavigationExample
        title="Breadcrumbs"
        description="Breadcrumb navigation for page hierarchy"
        code={`<nav className="flex" aria-label="Breadcrumb">
  <ol className="flex items-center space-x-2">
    <li>
      <a href="#" className="text-neutral-500 hover:text-primary-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className="sr-only">Home</span>
      </a>
    </li>
    <li className="flex items-center">
      <span className="text-neutral-400 mx-1">/</span>
      <a href="#" className="text-neutral-500 hover:text-primary-500">Communication</a>
    </li>
    <li className="flex items-center">
      <span className="text-neutral-400 mx-1">/</span>
      <a href="#" className="text-neutral-500 hover:text-primary-500">Channels</a>
    </li>
    <li className="flex items-center">
      <span className="text-neutral-400 mx-1">/</span>
      <span className="text-neutral-900 dark:text-neutral-100 font-medium">WhatsApp</span>
    </li>
  </ol>
</nav>`}
      >
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="sr-only">Home</span>
                </a>
              </li>
              <li className="flex items-center">
                <span className="text-neutral-400 mx-1">/</span>
                <a href="#" className="text-neutral-500 hover:text-primary-500">Communication</a>
              </li>
              <li className="flex items-center">
                <span className="text-neutral-400 mx-1">/</span>
                <a href="#" className="text-neutral-500 hover:text-primary-500">Channels</a>
              </li>
              <li className="flex items-center">
                <span className="text-neutral-400 mx-1">/</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">WhatsApp</span>
              </li>
            </ol>
          </nav>
        </div>
      </NavigationExample>
      
      <NavigationExample
        title="Tabs"
        description="Tab navigation for switching between related content"
        code={`<div className="border-b border-neutral-200 dark:border-neutral-800">
  <nav className="-mb-px flex space-x-8">
    <a href="#" className="border-primary-500 text-primary-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
      Overview
    </a>
    <a href="#" className="border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
      Analytics
    </a>
    <a href="#" className="border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
      Settings
    </a>
    <a href="#" className="border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
      Integrations
    </a>
  </nav>
</div>`}
      >
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <nav className="-mb-px flex space-x-8">
              <a href="#" className="border-primary-500 text-primary-500 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Overview
              </a>
              <a href="#" className="border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Analytics
              </a>
              <a href="#" className="border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Settings
              </a>
              <a href="#" className="border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Integrations
              </a>
            </nav>
          </div>
        </div>
      </NavigationExample>
    </div>
  );
};

export default Navigation;
