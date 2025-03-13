"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../Card";
import { Button } from "../Button";

const Cards: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card module="communication">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content of the card. You can put any content here.</p>
            </CardContent>
            <CardFooter>
              <Button module="communication" variant="outline" size="sm">Cancel</Button>
              <Button module="communication" size="sm" className="ml-2">Submit</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Default</h3>
            <Card module="communication">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Standard card with header, content, and footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button module="communication" size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Compact</h3>
            <Card module="communication" className="p-4">
              <CardTitle className="text-base mb-2">Compact Card</CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                A more compact card without separate header and footer sections.
              </p>
              <div className="mt-4">
                <Button module="communication" size="sm">Action</Button>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-neutral-500 dark:text-neutral-400">Bordered</h3>
            <Card module="communication" className="border-2 border-primary-500">
              <CardHeader>
                <CardTitle>Bordered Card</CardTitle>
                <CardDescription>Card with custom border styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button module="communication" size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Interactive Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card module="communication" className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Hoverable Card</CardTitle>
              <CardDescription>This card has hover effects</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Hover over this card to see the shadow effect.</p>
            </CardContent>
          </Card>

          <Card module="communication" className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription className="text-white/80">Card with gradient background</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a gradient background.</p>
            </CardContent>
            <CardFooter>
              <Button module="communication" variant="outline" className="text-white border-white hover:bg-white/20">
                Action
              </Button>
            </CardFooter>
          </Card>

          <Card module="communication" className="border border-dashed border-neutral-300 dark:border-neutral-700">
            <CardHeader>
              <CardTitle>Dashed Border Card</CardTitle>
              <CardDescription>Card with dashed border styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a dashed border.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Card with Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card module="communication" className="overflow-hidden">
            <div className="h-48 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
              <span className="text-neutral-500 dark:text-neutral-400">Image Placeholder</span>
            </div>
            <CardHeader>
              <CardTitle>Card with Image</CardTitle>
              <CardDescription>Card with an image at the top</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has an image at the top.</p>
            </CardContent>
            <CardFooter>
              <Button module="communication" size="sm">View Details</Button>
            </CardFooter>
          </Card>

          <Card module="communication">
            <CardHeader>
              <CardTitle>Card with Icon</CardTitle>
              <CardDescription>Card with an icon in the header</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p>This card has an icon next to the content.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button module="communication" size="sm">Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cards;
