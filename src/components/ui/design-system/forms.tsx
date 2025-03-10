"use client";

import React from "react";

interface FormExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  code: string;
}

const FormExample: React.FC<FormExampleProps> = ({
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

export const Forms: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Edunéxia Form System</h2>
      
      <FormExample
        title="Basic Input"
        description="Standard text input field"
        code={`<div className="mb-4">
  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
    Name
  </label>
  <input
    type="text"
    id="name"
    className="input-primary"
    placeholder="Enter your name"
  />
</div>`}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="input-primary"
            placeholder="Enter your name"
          />
        </div>
      </FormExample>
      
      <FormExample
        title="Input with Icon"
        description="Text input with leading icon"
        code={`<div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
    Email
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    </div>
    <input
      type="email"
      id="email"
      className="input-primary pl-10"
      placeholder="you@example.com"
    />
  </div>
</div>`}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              className="input-primary pl-10"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </FormExample>
      
      <FormExample
        title="Form Group"
        description="Group of form elements with validation"
        code={`<div className="space-y-4">
  <div>
    <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
      Username
    </label>
    <input
      type="text"
      id="username"
      className="input-primary"
      placeholder="Enter username"
    />
  </div>
  
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
      Password
    </label>
    <input
      type="password"
      id="password"
      className="input-primary border-red-500 focus:border-red-500 focus:ring-red-500"
      placeholder="Enter password"
    />
    <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters</p>
  </div>
  
  <div className="flex items-center">
    <input
      id="remember-me"
      type="checkbox"
      className="h-4 w-4 text-primary-500 border-neutral-300 rounded"
    />
    <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
      Remember me
    </label>
  </div>
  
  <div>
    <button className="btn-primary w-full">
      Sign in
    </button>
  </div>
</div>`}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input-primary"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-primary border-red-500 focus:border-red-500 focus:ring-red-500"
              placeholder="Enter password"
            />
            <p className="mt-1 text-sm text-red-600">Password must be at least 8 characters</p>
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
              Remember me
            </label>
          </div>
          
          <div>
            <button className="btn-primary w-full">
              Sign in
            </button>
          </div>
        </div>
      </FormExample>
      
      <FormExample
        title="Select Input"
        description="Dropdown select input"
        code={`<div className="mb-4">
  <label htmlFor="country" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
    Country
  </label>
  <select
    id="country"
    className="input-primary"
  >
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="mx">Mexico</option>
    <option value="br">Brazil</option>
  </select>
</div>`}
      >
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Country
          </label>
          <select
            id="country"
            className="input-primary"
          >
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="mx">Mexico</option>
            <option value="br">Brazil</option>
          </select>
        </div>
      </FormExample>
      
      <FormExample
        title="Textarea"
        description="Multi-line text input"
        code={`<div className="mb-4">
  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
    Message
  </label>
  <textarea
    id="message"
    rows={4}
    className="input-primary"
    placeholder="Enter your message"
  ></textarea>
</div>`}
      >
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="input-primary"
            placeholder="Enter your message"
          ></textarea>
        </div>
      </FormExample>
      
      <FormExample
        title="Radio Group"
        description="Radio button group for single selection"
        code={`<div className="mb-4">
  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
    Notification preferences
  </label>
  <div className="space-y-2">
    <div className="flex items-center">
      <input
        id="push-everything"
        name="push-notifications"
        type="radio"
        className="h-4 w-4 text-primary-500 border-neutral-300"
      />
      <label htmlFor="push-everything" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
        All new messages
      </label>
    </div>
    <div className="flex items-center">
      <input
        id="push-email"
        name="push-notifications"
        type="radio"
        className="h-4 w-4 text-primary-500 border-neutral-300"
        checked
      />
      <label htmlFor="push-email" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
        Only emails
      </label>
    </div>
    <div className="flex items-center">
      <input
        id="push-nothing"
        name="push-notifications"
        type="radio"
        className="h-4 w-4 text-primary-500 border-neutral-300"
      />
      <label htmlFor="push-nothing" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
        No notifications
      </label>
    </div>
  </div>
</div>`}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Notification preferences
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="push-everything"
                name="push-notifications"
                type="radio"
                className="h-4 w-4 text-primary-500 border-neutral-300"
              />
              <label htmlFor="push-everything" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                All new messages
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="push-email"
                name="push-notifications"
                type="radio"
                className="h-4 w-4 text-primary-500 border-neutral-300"
                defaultChecked
              />
              <label htmlFor="push-email" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                Only emails
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="push-nothing"
                name="push-notifications"
                type="radio"
                className="h-4 w-4 text-primary-500 border-neutral-300"
              />
              <label htmlFor="push-nothing" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                No notifications
              </label>
            </div>
          </div>
        </div>
      </FormExample>
      
      <FormExample
        title="Toggle Switch"
        description="Toggle switch for boolean settings"
        code={`<div className="flex items-center justify-between">
  <span className="flex-grow flex flex-col">
    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Automatic updates</span>
    <span className="text-sm text-neutral-500">Keep application up to date automatically</span>
  </span>
  <button
    type="button"
    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-primary-500 focus:outline-none"
    role="switch"
    aria-checked="true"
  >
    <span className="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
    ></span>
  </button>
</div>`}
      >
        <div className="flex items-center justify-between">
          <span className="flex-grow flex flex-col">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Automatic updates</span>
            <span className="text-sm text-neutral-500">Keep application up to date automatically</span>
          </span>
          <button
            type="button"
            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-primary-500 focus:outline-none"
            role="switch"
            aria-checked="true"
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            ></span>
          </button>
        </div>
      </FormExample>
    </div>
  );
};

export default Forms;
