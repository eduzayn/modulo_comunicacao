"use client";

import React from "react";

interface TypographyExampleProps {
  title: string;
  description: string;
  className: string;
  textSample: string;
  fontDetails?: string;
}

const TypographyExample: React.FC<TypographyExampleProps> = ({
  title,
  description,
  className,
  textSample,
  fontDetails,
}) => {
  return (
    <div className="mb-8 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        </div>
        {fontDetails && (
          <div className="mt-2 md:mt-0 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            {fontDetails}
          </div>
        )}
      </div>
      <div className={`${className} border-t border-neutral-200 dark:border-neutral-800 pt-4`}>
        {textSample}
      </div>
    </div>
  );
};

export const Typography: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Edunéxia Typography System</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Font Family</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm font-medium mb-2">Sans Serif (Primary)</div>
            <div className="font-sans">The quick brown fox jumps over the lazy dog.</div>
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              var(--font-sans)
            </div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm font-medium mb-2">Serif</div>
            <div className="font-serif">The quick brown fox jumps over the lazy dog.</div>
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              var(--font-serif)
            </div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm font-medium mb-2">Monospace</div>
            <div className="font-mono">The quick brown fox jumps over the lazy dog.</div>
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              var(--font-mono)
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Headings</h3>
        
        <TypographyExample
          title="Heading 1"
          description="Used for main page titles"
          className="text-4xl font-bold"
          textSample="Edunéxia Communication Module"
          fontDetails="text-4xl font-bold (2.25rem)"
        />
        
        <TypographyExample
          title="Heading 2"
          description="Used for section titles"
          className="text-3xl font-bold"
          textSample="Communication Channels"
          fontDetails="text-3xl font-bold (1.875rem)"
        />
        
        <TypographyExample
          title="Heading 3"
          description="Used for subsection titles"
          className="text-2xl font-semibold"
          textSample="WhatsApp Integration"
          fontDetails="text-2xl font-semibold (1.5rem)"
        />
        
        <TypographyExample
          title="Heading 4"
          description="Used for card titles and smaller sections"
          className="text-xl font-semibold"
          textSample="Message Templates"
          fontDetails="text-xl font-semibold (1.25rem)"
        />
        
        <TypographyExample
          title="Heading 5"
          description="Used for smaller components"
          className="text-lg font-medium"
          textSample="Template Categories"
          fontDetails="text-lg font-medium (1.125rem)"
        />
        
        <TypographyExample
          title="Heading 6"
          description="Used for the smallest titled elements"
          className="text-base font-medium"
          textSample="Template Variables"
          fontDetails="text-base font-medium (1rem)"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Body Text</h3>
        
        <TypographyExample
          title="Body Large"
          description="Used for important paragraphs"
          className="text-lg"
          textSample="The Edunéxia Communication Module provides a comprehensive solution for managing all interactions and communications within the educational platform. It combines messaging, artificial intelligence, and channel management to deliver an efficient and personalized communication experience."
          fontDetails="text-lg (1.125rem)"
        />
        
        <TypographyExample
          title="Body Default"
          description="Used for standard paragraphs"
          className="text-base"
          textSample="The Communication Module integrates with multiple channels including WhatsApp Business API, Email Marketing, Internal Chat, SMS, and Push Notifications. It supports real-time conversations, message templates, and automated responses powered by AI."
          fontDetails="text-base (1rem)"
        />
        
        <TypographyExample
          title="Body Small"
          description="Used for secondary information"
          className="text-sm"
          textSample="Configure channels by user profile, integrate with external APIs, monitor delivery status, and analyze engagement metrics. The system provides comprehensive analytics and reporting capabilities."
          fontDetails="text-sm (0.875rem)"
        />
        
        <TypographyExample
          title="Caption"
          description="Used for captions and helper text"
          className="text-xs"
          textSample="Last updated: March 10, 2025. System version 2.3.0"
          fontDetails="text-xs (0.75rem)"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Font Weights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm mb-2">Light (300)</div>
            <div className="font-light text-lg">Edunéxia</div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm mb-2">Regular (400)</div>
            <div className="font-normal text-lg">Edunéxia</div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm mb-2">Medium (500)</div>
            <div className="font-medium text-lg">Edunéxia</div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm mb-2">Semibold (600)</div>
            <div className="font-semibold text-lg">Edunéxia</div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm mb-2">Bold (700)</div>
            <div className="font-bold text-lg">Edunéxia</div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Special Text Styles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm font-medium mb-2">Gradient Text</div>
            <div className="gradient-text text-xl font-bold">Edunéxia Platform</div>
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              gradient-text
            </div>
          </div>
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="text-sm font-medium mb-2">Link Text</div>
            <div className="text-primary hover:text-primary-600 transition-colors cursor-pointer">
              Click to learn more about Edunéxia
            </div>
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              text-primary hover:text-primary-600
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Typography;
