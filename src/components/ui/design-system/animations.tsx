"use client";

import React, { useState, useEffect } from "react";

interface AnimationExampleProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  code: string;
}

const AnimationExample: React.FC<AnimationExampleProps> = ({
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

export const Animations: React.FC = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [spin, setSpin] = useState(false);

  // Reset animations after they complete
  useEffect(() => {
    if (fadeIn) {
      const timer = setTimeout(() => setFadeIn(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [fadeIn]);

  useEffect(() => {
    if (slideIn) {
      const timer = setTimeout(() => setSlideIn(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [slideIn]);

  useEffect(() => {
    if (pulse) {
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  useEffect(() => {
    if (bounce) {
      const timer = setTimeout(() => setBounce(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [bounce]);

  useEffect(() => {
    if (spin) {
      const timer = setTimeout(() => setSpin(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [spin]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Animation System</h2>
      
      <AnimationExample
        title="Fade In Animation"
        description="Smooth fade-in animation for elements"
        code={`<div className={\`transition-opacity duration-300 \${
  fadeIn ? 'opacity-100' : 'opacity-0'
}\`}>
  Content to fade in
</div>

// Trigger with:
setFadeIn(true);`}
      >
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setFadeIn(true)}
            className="btn-primary mb-4"
          >
            Trigger Fade In
          </button>
          
          <div className={`p-4 bg-primary-100 dark:bg-primary-900 rounded-md transition-opacity duration-300 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-primary-800 dark:text-primary-100">This content fades in smoothly</p>
          </div>
        </div>
      </AnimationExample>
      
      <AnimationExample
        title="Slide In Animation"
        description="Elements slide in from the bottom"
        code={`<div className={\`transition-all duration-300 transform \${
  slideIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
}\`}>
  Content to slide in
</div>

// Trigger with:
setSlideIn(true);`}
      >
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setSlideIn(true)}
            className="btn-primary mb-4"
          >
            Trigger Slide In
          </button>
          
          <div className={`p-4 bg-secondary-100 dark:bg-secondary-900 rounded-md transition-all duration-300 transform ${
            slideIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <p className="text-secondary-800 dark:text-secondary-100">This content slides in from below</p>
          </div>
        </div>
      </AnimationExample>
      
      <AnimationExample
        title="Pulse Animation"
        description="Attention-grabbing pulse effect"
        code={`<div className={\`\${pulse ? 'animate-pulse' : ''}\`}>
  Content to pulse
</div>

// Trigger with:
setPulse(true);`}
      >
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setPulse(true)}
            className="btn-primary mb-4"
          >
            Trigger Pulse
          </button>
          
          <div className={`p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md ${
            pulse ? 'animate-pulse' : ''
          }`}>
            <p className="text-neutral-800 dark:text-neutral-100">This content pulses to grab attention</p>
          </div>
        </div>
      </AnimationExample>
      
      <AnimationExample
        title="Bounce Animation"
        description="Playful bounce effect for interactive elements"
        code={`<div className={\`transition-transform \${
  bounce ? 'animate-bounce' : ''
}\`}>
  Content to bounce
</div>

// Trigger with:
setBounce(true);`}
      >
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setBounce(true)}
            className="btn-primary mb-4"
          >
            Trigger Bounce
          </button>
          
          <div className={`inline-block p-4 bg-semantic-success text-white rounded-md ${
            bounce ? 'animate-bounce' : ''
          }`}>
            <p>This content bounces</p>
          </div>
        </div>
      </AnimationExample>
      
      <AnimationExample
        title="Spin Animation"
        description="Rotating animation for loading indicators"
        code={`<div className={\`transition-transform \${
  spin ? 'animate-spin' : ''
}\`}>
  <svg className="h-8 w-8" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
</div>

// Trigger with:
setSpin(true);`}
      >
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setSpin(true)}
            className="btn-primary mb-4"
          >
            Trigger Spin
          </button>
          
          <div className={`text-primary-500 ${
            spin ? 'animate-spin' : ''
          }`}>
            <svg className="h-8 w-8" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </AnimationExample>
      
      <AnimationExample
        title="Gradient Animation"
        description="Animated gradient background effect"
        code={`<div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-[length:200%_100%] animate-gradient text-white p-4 rounded-md">
  Content with animated gradient
</div>

/* In your CSS */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}`}
      >
        <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-[length:200%_100%] animate-gradient text-white p-4 rounded-md">
          <p>This content has an animated gradient background</p>
        </div>
      </AnimationExample>
      
      <AnimationExample
        title="Scale Animation"
        description="Elements that grow or shrink on interaction"
        code={`<div className="group">
  <div className="transition-transform duration-300 group-hover:scale-110">
    Hover me to scale
  </div>
</div>`}
      >
        <div className="flex justify-center">
          <div className="group cursor-pointer">
            <div className="transition-transform duration-300 group-hover:scale-110 p-4 bg-primary-100 dark:bg-primary-900 rounded-md text-primary-800 dark:text-primary-100">
              Hover me to scale
            </div>
          </div>
        </div>
      </AnimationExample>
      
      <AnimationExample
        title="Staggered Animation"
        description="Multiple elements animating in sequence"
        code={`<div className="space-y-2">
  {[0, 1, 2].map((index) => (
    <div
      key={index}
      className="transition-all duration-300 transform opacity-0 translate-y-4"
      style={{ 
        animationName: staggered ? 'fadeInUp' : 'none',
        animationDuration: '0.5s',
        animationFillMode: 'forwards',
        animationDelay: \`\${index * 0.1}s\` 
      }}
    >
      Item {index + 1}
    </div>
  ))}
</div>

/* In your CSS */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`}
      >
        <div className="flex flex-col items-center">
          <button 
            onClick={() => {
              const items = document.querySelectorAll('.staggered-item');
              items.forEach((item, index) => {
                (item as HTMLElement).style.animationName = 'fadeInUp';
                (item as HTMLElement).style.animationDelay = `${index * 0.1}s`;
              });
              
              // Reset after animation completes
              setTimeout(() => {
                items.forEach((item) => {
                  (item as HTMLElement).style.animationName = 'none';
                  (item as HTMLElement).style.opacity = '0';
                  (item as HTMLElement).style.transform = 'translateY(1rem)';
                });
              }, 2000);
            }}
            className="btn-primary mb-4"
          >
            Trigger Staggered Animation
          </button>
          
          <div className="space-y-2 w-full max-w-xs">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="staggered-item p-3 bg-white dark:bg-neutral-800 rounded-md shadow-sm transition-all duration-300 transform opacity-0 translate-y-4"
                style={{ 
                  animationDuration: '0.5s',
                  animationFillMode: 'forwards'
                }}
              >
                <p className="text-neutral-800 dark:text-neutral-200">Item {index + 1}</p>
              </div>
            ))}
          </div>
          
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(1rem);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </AnimationExample>
    </div>
  );
};

export default Animations;
