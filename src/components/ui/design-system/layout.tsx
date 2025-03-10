"use client";

import React from "react";

interface LayoutExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  code: string;
}

const LayoutExample: React.FC<LayoutExampleProps> = ({
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

export const Layout: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Edunéxia Layout System</h2>
      
      <LayoutExample
        title="Dashboard Layout"
        description="Main dashboard layout with sidebar navigation"
        code={`<div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
  {/* Sidebar */}
  <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen">
    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="text-primary-500 font-bold text-xl">Edunéxia</div>
    </div>
    <nav className="p-4 space-y-1">
      {/* Navigation items */}
    </nav>
  </aside>
  
  {/* Main content */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* User profile, notifications, etc. */}
        </div>
      </div>
    </header>
    
    {/* Content area */}
    <main className="flex-1 overflow-auto p-6">
      {/* Page content */}
    </main>
  </div>
</div>`}
      >
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden h-96">
          <div className="flex h-full bg-neutral-50 dark:bg-neutral-900">
            {/* Sidebar */}
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
              </nav>
            </aside>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <div className="px-4 py-3 flex justify-between items-center">
                  <h1 className="text-lg font-semibold">Dashboard</h1>
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
              </header>
              
              {/* Content area */}
              <main className="flex-1 overflow-auto p-6 bg-neutral-50 dark:bg-neutral-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold mb-2">Total Channels</h3>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold mb-2">Active Conversations</h3>
                    <p className="text-3xl font-bold">48</p>
                  </div>
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold mb-2">Templates</h3>
                    <p className="text-3xl font-bold">24</p>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </LayoutExample>
      
      <LayoutExample
        title="Content Layout"
        description="Content layout with header and main content area"
        code={`<div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
  {/* Header */}
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
          {/* User profile, notifications, etc. */}
        </div>
      </div>
    </div>
  </header>
  
  {/* Main content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Page content */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {/* Main content area */}
      </div>
      <div className="md:col-span-1">
        {/* Sidebar content */}
      </div>
    </div>
  </main>
</div>`}
      >
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden h-96">
          <div className="min-h-full bg-neutral-50 dark:bg-neutral-900">
            {/* Header */}
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
            
            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="card p-4">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">New message from John Doe</p>
                          <p className="text-xs text-neutral-500">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">New conversation started</p>
                          <p className="text-xs text-neutral-500">10 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="card p-4">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                      <button className="btn-primary w-full">New Conversation</button>
                      <button className="btn-outline w-full">Create Template</button>
                      <button className="btn-ghost w-full">View Reports</button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </LayoutExample>
      
      <LayoutExample
        title="Card Grid Layout"
        description="Grid layout for displaying cards"
        code={`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card p-4">
    <h3 className="text-lg font-semibold mb-2">Card Title</h3>
    <p className="text-neutral-600 dark:text-neutral-400">Card content goes here.</p>
  </div>
  <div className="card p-4">
    <h3 className="text-lg font-semibold mb-2">Card Title</h3>
    <p className="text-neutral-600 dark:text-neutral-400">Card content goes here.</p>
  </div>
  <div className="card p-4">
    <h3 className="text-lg font-semibold mb-2">Card Title</h3>
    <p className="text-neutral-600 dark:text-neutral-400">Card content goes here.</p>
  </div>
</div>`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Card Title</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Card content goes here.</p>
          </div>
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Card Title</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Card content goes here.</p>
          </div>
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Card Title</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Card content goes here.</p>
          </div>
        </div>
      </LayoutExample>
    </div>
  );
};

export default Layout;
